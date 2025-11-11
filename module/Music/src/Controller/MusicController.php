<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Music\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Music\Entity\Groups;
use Music\Entity\SongInfo;
use Zend\View\Model\JsonModel;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Doctrine\ORM\Query\ResultSetMapping as ResultSetMapping;
use Zend\Paginator\Paginator;
use Music\Module;

class MusicController extends AbstractActionController {

    /**
     *
     * @var Doctrine\ORM\EntityManager
     */
    private $entityManager;    

    public function __construct($entityManager) {
        $this->entityManager = $entityManager;        
    }

    /**
     * 
     * @return ViewModel
     */
    public function indexAction() {
        return new ViewModel();
    }

    public function categoriesAction() {
        $groups = $this->entityManager->getRepository(Groups::class)
                ->findAll();

        $viewModel = new ViewModel([
            'groups' => $groups
        ]);

        $viewModel->setTerminal(true);
        return $viewModel;
    }
    
    public function getCategoryListAction() { 
        $lang = $this->params()->fromQuery('lang');
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('idGroup', 'id');
        $resultMap->addScalarResult('Name', 'Name');
        $resultMap->addScalarResult('orderBy', 'orderBy');
        $resultMap->addScalarResult('state', 'state');
        $query = $entityManager->createNativeQuery("call getSongGroups(:lang)", $resultMap);                        
        $query->setParameter("lang", $lang);
        
        $groups = $query->execute();
        
        $data = [];
        
        foreach ($groups as $group) {
            $newData = [
                'id' => $group[id],
                'name' => $group[Name]                
            ];
            array_push($data, $newData);
        }
        
         return new JsonModel($data);        
    }
    
    public function nonstopAction(){
        $groups = $this->entityManager->getRepository(Groups::class)
                ->findAll();

        $viewModel = new ViewModel([
            'groups' => $groups
        ]);
        
        $viewModel->setTerminal(true);
        return $viewModel;
    }
    
    public function getRandomSongAction(){
        $groups = (string) $this->params()->fromPost('groups');     
        $last = (string) $this->params()->fromPost('last');     
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('maxX', 'maxX');
        $query = $entityManager->createNativeQuery("call getMaxX(:inGroups)", $resultMap);        
        $query->setParameter("inGroups", $groups);        
        $maxX = (int)$query->execute()[0]["maxX"];        
        
        $resultMap1 = new ResultSetMapping($entityManager);
        $resultMap1->addScalarResult('idSong', 'id');
        $resultMap1->addScalarResult('Name', 'name');
        $resultMap1->addScalarResult('Songer', 'songer');
        $resultMap1->addScalarResult('Album', 'album');
        $query1 = $entityManager->createNativeQuery("call getOrderSong(:groups, :last, :maxX)", $resultMap1);        
        $query1->setParameters([
            "groups" => $groups,
            "last" => $last,
            "maxX" => $maxX]);
        $randomSong = $query1->execute();
         return new JsonModel([
            'song' => $randomSong
        ]);
    }    

    public function listAction() {
        $filterBy = (string) $this->params()->fromRoute('filterBy');
        $criteria = base64_decode((string) $this->params()->fromPost('criteria'));

        $viewModel = new ViewModel([
            'filterBy' => $filterBy,
            'criteria' => $criteria
        ]);

        $viewModel->setTerminal(true);
        return $viewModel;
    }

    public function reestrAction() {
        $target = (string) $this->params()->fromRoute('target');
        $filterBy = (string) $this->params()->fromRoute('filterBy');
        $criteria = base64_decode((string) $this->params()->fromQuery('criteria'));

        //$repository = $this->entityManager->getRepository(SongInfo::class);
        //get songs count
        $queryBuilder = $this->entityManager->createQueryBuilder();        

        switch ($filterBy) {
            case 'byChar':
                switch ($target) {
                    case 'Albums':
                        $queryBuilder->select('c.album')
                                ->from(SongInfo::class, 'c');
                        $queryBuilder->where("upper(substring(c.album,1,1)) = upper(?1)");
                        $queryBuilder->setParameter('1', $criteria);
                        $queryBuilder->orderBy('c.album', 'ASC');
                        break;
                    case 'Songers':
                        $queryBuilder->select('c.songer')
                                ->from(SongInfo::class, 'c');
                        $queryBuilder->where("upper(substring(c.songer,1,1)) = upper(?1) and (c.state is null or c.state != 'block')");
                        $queryBuilder->setParameter('1', $criteria);
                        $queryBuilder->orderBy('c.songer', 'ASC');
                        break;
                }                
                break;
            case 'byText':
                switch ($target) {
                    case 'Albums':
                        $queryBuilder->select('c.album')
                                ->from(SongInfo::class, 'c');
                        $queryBuilder->where("MATCH_AGAINST(c.album, ?1) > 0");
                        $queryBuilder->setParameter('1', $criteria);                        
                        $queryBuilder->orderBy('c.album', 'ASC');
                        break;
                    case 'Songers':
                        $queryBuilder->select('c.songer')
                                ->from(SongInfo::class, 'c');
                        $queryBuilder->where("MATCH_AGAINST(c.songer, ?1) > 0  and (c.state is null or c.state != 'block')");
                        $queryBuilder->setParameter('1', $criteria);
                        $queryBuilder->orderBy('c.songer', 'ASC');
                        break;
                }
                break;
        }

        $queryBuilder->distinct();
        $reestr = $queryBuilder->getQuery()->execute();

        $viewModel = new ViewModel([
            'target' => $target,
            'filterBy' => $filterBy,
            'criteria' => $criteria,
            'reestr' => $reestr
        ]);

        $viewModel->setTerminal(true);
        return $viewModel;
    }

    public function getSongListAction() {
        /*
         * requireTotalCount: true
          searchOperation: contains
          searchValue:
          skip: 0
          take: 20
          sort:
         */
        $skip = (int) $this->params()->fromPost('skip');
        $take = (int) $this->params()->fromPost('take');
        //$searchValue = $this->params()->fromPost('searchValue');
        $sort = $this->params()->fromPost('sort');
        $filterBy = (string) $this->params()->fromPost('filterBy');
        $criteria = (string) $this->params()->fromPost('criteria');

        //prepare sorting
        $entitySort = [];
        foreach ($sort as $s) {
            $entitySort[$s['selector']] = ($s['desc'] != 'true' ? 'ASC' : 'DESC' );
        }

        $repository = $this->entityManager->getRepository(SongInfo::class);

        //applying filter        
        if ($filterBy != null && $criteria != null) {
            switch ($filterBy) {
                case 'byCategory':
                case 'bySonger':
                case 'byAlbum':

                    switch ($filterBy) {
                        case 'byCategory':
                            $entityFilter = ['idGroup' => $criteria];
                            break;
                        case 'bySonger':
                            $entityFilter = ['songer' => $criteria];
                            break;
                        case 'byAlbum':
                            $entityFilter = ['album' => $criteria];
                            break;
                        default :
                            $entityFilter = [];
                            break;
                    }
                    
                    if($filterBy == 'byAlbum' && $entitySort == null){
                        $entitySort['albumSort'] = 'ASC';
                        $entitySort[id] = 'ASC';
                    }
                    $songCount = $repository->count($entityFilter);
                    $songList = $repository->findBy($entityFilter, $entitySort, $take, $skip);
                    break;
                case 'byChar':
                case 'byText':
                    //get songs count
                    $queryBuilder = $this->entityManager->createQueryBuilder();
                    $queryBuilder->select('count(c.id)')
                            ->from(SongInfo::class, 'c');

                    switch ($filterBy) {
                        case 'byChar':
                            $queryBuilder->where("upper(substring(c.name,1,1)) = upper(?1)");
                            $queryBuilder->setParameter('1', $criteria);
                            break;
                        case 'byText':
                            $entityManager = $this->entityManager;
                            $resultMap1 = new ResultSetMapping($entityManager);
                            $resultMap1->addScalarResult('cnt', 'cnt');
                            $queryCnt = $entityManager->createNativeQuery("call totalTracks(:criteria)", $resultMap1);        
                            $queryCnt->setParameter("criteria", $criteria);
                            $total = (int)$queryCnt->execute()[0]["cnt"];  
                            
                            
                            $resultMap2 = new ResultSetMapping($entityManager);
                            $resultMap2->addScalarResult('idSong', 'id');
                            $resultMap2->addScalarResult('Name', 'name');
                            $resultMap2->addScalarResult('Songer', 'songer');
                            $resultMap2->addScalarResult('Album', 'album');
                            $resultMap2->addScalarResult('songYear', 'year');
                            $resultMap2->addScalarResult('fileSize', 'fileSize');
                            $resultMap2->addScalarResult('bitrate', 'bitrate');
                            $resultMap2->addScalarResult('ext', 'ext');
                            $query = $entityManager->createNativeQuery("call searchTracks(:criteria, :skip, :take)", $resultMap2);        
                            
                            $query->setParameter("criteria", $criteria);
                            $query->setParameter("skip", $skip);
                            $query->setParameter("take", $take);
                            
                            $tracks = $query->execute();
                            
                            //prepare data gird data                            
                            return new JsonModel([
                                'data' => $tracks,
                                'total' => $total
                            ]); 
                    }

                    $songCount = (int) $queryBuilder->getQuery()->execute()[0][1];
                    //get song list
                    $queryBuilder->select('c');

                    foreach ($sort as $s) {
                        $orderName = 'c.' . $s['selector'];
                        $ifDesc = ($s['desc'] != 'true' ? 'ASC' : 'DESC');
                        $queryBuilder = $queryBuilder->addOrderBy($orderName, $ifDesc);
                    }

                    $songQuery = $queryBuilder->getQuery();
                    $adapter = new DoctrineAdapter(new ORMPaginator($songQuery, false));
                    $paginator = new Paginator($adapter);
                    $paginator->setDefaultItemCountPerPage($take);
                    $songList = $paginator->setCurrentPageNumber((int) ($skip / $take) + 1);
                    break;
                default:
                    $songCount = $repository->count([]);
                    $songList = $repository->findBy([], $entitySort, $take, $skip);
                    break;
            }
        }
        //prepare data gird data
        $data = [];
        foreach ($songList as $song) {
            $newData = [
                'id' => $song->getId(),
                'name' => $song->getName(),
                'songer' => $song->getSonger(),
                'album' => $song->getAlbum(),                
                'year' => $song->getSongYear(),
                'fileSize' => $song->getFileSize(),
                'bitrate' => $song->getBitrate(),
                'ext' => $song->getExt()
            ];
            array_push($data, $newData);
        }
        return new JsonModel([
            'data' => $data,
            'total' => $songCount
        ]);
    }

    public function getSongAction() {      
        //check token
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();        
        if(!$this->checkToken($token)) {
            return $this->getResponse();
        }
        //----------------------------------
        
        $id = (int) $this->params()->fromRoute('id');
        $ext = $this->getExtension($id);
        $this->redirect()->toUrl('/audio/'. $id . '.' . $ext);
        
        /*$filePath = Module::AUDIO_FILES_PATH .$id.".mp3";
        
        $mp3Content = file_get_contents($filePath);        
    
        // Пропускаем ID3v2-тег (если есть)
        if (substr($mp3Content, 0, 3) === 'ID3') {
            $id3v2Size = unpack('N', substr($mp3Content, 6, 4))[1] + 10;
            $mp3Content = substr($mp3Content, $id3v2Size);            
        }
    
        
        $response = $this->getResponse();       
        
        $response->setContent($mp3Content);        
        
        $headers = $response->getHeaders();
        $headers->addHeaderLine("Accept-Ranges", "bytes");        
        $headers->addHeaderLine("Content-Length",strlen($mp3Content));
        $headers->addHeaderLine("Content-Type", "audio/mpeg");
        //$headers->addHeaderLine("Content-Disposition: attachment; filename=\"".$id.".mp3\"");
        $headers->addHeaderLine("Content-Disposition", "inline; filename=\"".$id.".mp3\"");
        $headers->addHeaderLine("Content-Transfer-Encoding", "binary");         
        
        return $response;
         * *
         */
    }
    
    public function addToReportAction(){
        //check token
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();        
         if(!$this->checkToken($token)) {
             return $this->getResponse();
         }
        //----------------------------------
        
        $trackId = (int) $this->params()->fromPost('id');        
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('id', 'id');
        $resultMap->addScalarResult('month', 'month');
        $resultMap->addScalarResult('year', 'year');        
        $resultMap->addScalarResult('completed', 'completed');        
        $query = $entityManager->createNativeQuery("call addToReport(:id)", $resultMap);                        
        $query->setParameter("id", $trackId);
        
        $query->execute();
        
        //$message = "Track was added to report successfuly";
        //$headers = $response->getHeaders();
        //$response->setContent($data);        
        return new JsonModel([
            'result' => 0,           
        ]);
    }
    
    private function checkToken($token){
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('id', 'id');
        $resultMap->addScalarResult('name', 'Name');
        $resultMap->addScalarResult('until', 'until');        
        $query = $entityManager->createNativeQuery("call getToken(:token)", $resultMap);                        
        $query->setParameter("token", $token);
        
        $tokenInfo = $query->execute();
        $count = sizeof($tokenInfo);
        if($count == 0) {             
            return false;          
        } else {
            return true;
        }
    }
    
    private function getExtension($id){        
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('ext', 'ext');
        $query = $entityManager->createNativeQuery("call getExtension(:id)", $resultMap);                        
        $query->setParameter("id", $id);
        
        $ext = $query->execute()[0]["ext"];
        return $ext;
    }
}
