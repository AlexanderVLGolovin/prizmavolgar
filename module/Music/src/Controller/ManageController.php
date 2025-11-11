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

class ManageController extends AbstractActionController {

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
        //return new ViewModel();
        phpinfo();
    }
    
    public function getGenresAction() { 
        $lang = $this->params()->fromQuery('lang');
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('idGroup', 'id');
        $resultMap->addScalarResult('Name', 'Name');
        $resultMap->addScalarResult('orderBy', 'orderBy');
        $resultMap->addScalarResult('state', 'state');
        $queryBuilder = $entityManager->createQueryBuilder();       
        $queryBuilder->select('c.id, c.name, c.state')
                                ->from(Groups::class, 'c');
        $queryBuilder->orderBy('c.orderBy', 'ASC');
        
        $groups = $queryBuilder->getQuery()->execute();        
        
        $data = [];
        
        foreach ($groups as $group) {
            $newData = [
                'id' => $group[id],
                'name' => $group[name],
                'state' => $group[state]
            ];
            array_push($data, $newData);
        }
        
         return new JsonModel($data);        
    }
    
    public function addTrackInfoAction() {
        //check token
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();        
        if(!$this->checkToken($token)) {
             return new JsonModel([
            'idSong' => -1
        ]);
        }
        //----------------------------------
        
        $idGroup = (int) $this->params()->fromPost('idGroup');          
        $title = $this->params()->fromPost('title');     
        $artist = $this->params()->fromPost('artist');     
        $album = $this->params()->fromPost('album');     
        $tags = $this->params()->fromPost('tags');     
        $albumSort = (int) $this->params()->fromPost('albumSort');     
        $size = $this->params()->fromPost('size');     
        $ext = $this->params()->fromPost('ext');     
        $composer = $this->params()->fromPost('composer');     
        $year = (int) $this->params()->fromPost('year');             
        $bitrate = (int) $this->params()->fromPost('bitrate');             
        $sampleRate = (int) $this->params()->fromPost('sampleRate');             
        $channels = (int) $this->params()->fromPost('channels');         
        $noBroadcast = $this->params()->fromPost('noBroadcast') == "True"; 
        
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('idSong', 'idSong');
        $query = $entityManager->createNativeQuery("call addTrackinfo(:idGroup, :title, :artist, :album, :tags, :albumSort, :size, :ext, :composer, :year, :bitrate, :sampleRate, :channels, :noBroadcast)", $resultMap);        
        $query->setParameter("idGroup", $idGroup);
        $query->setParameter("title", $title, 'string');
        $query->setParameter("artist", $artist, 'string');
        $query->setParameter("album", $album, "string");
        $query->setParameter("tags", $tags, "string");
        $query->setParameter("albumSort", $albumSort);
        $query->setParameter("size", $size);
        $query->setParameter("ext", $ext);
        $query->setParameter("composer", $composer, "string");
        $query->setParameter("year", $year);
        $query->setParameter("bitrate", $bitrate);
        $query->setParameter("sampleRate", $sampleRate);
        $query->setParameter("channels", $channels);
        $query->setParameter("noBroadcast", $noBroadcast);
        
        $idSong = (int)$query->execute()[0]["idSong"];        
        
        return new JsonModel([
            'idSong' => $idSong
        ]);
    }
    
    public function addTrackAction() {
        //check token
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();
        if (!$this->checkToken($token)) {
            return new JsonModel([
                'idSong' => -1
            ]);
        }
        //----------------------------------

        $id = (int) $this->params()->fromQuery('idSong');
        $track = $_FILES["file"];
        $ext = $this->getExtension($id);        
        //$data = \file_get_contents($track["tmp_name"]);
        
        $destination = Module::AUDIO_FILES_PATH .$id.".".$ext;
        
        // Перемещаем файл из временной папки
        if (move_uploaded_file($track["tmp_name"], $destination)) {            
            return new JsonModel([
                'idSong' => $id
            ]);
        } else {
            return new JsonModel([
                'idSong' => -1
            ]);
        }
    }
    
    public function updateTrackinfoAction() {
    //check token
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();        
        if(!$this->checkToken($token)) {
             return new JsonModel([
            'idSong' => -1
        ]);
        }
        //----------------------------------
        
        $id = (int)$this->params()->fromPost('id');      
        $title = $this->params()->fromPost('title');     
        $artist = $this->params()->fromPost('artist');     
        $album = $this->params()->fromPost('album');     
        $tags = $this->params()->fromPost('tags');     
        $albumSort = (int) $this->params()->fromPost('albumSort');     
        $size = $this->params()->fromPost('size');     
        $ext = $this->params()->fromPost('ext');     
        $composer = $this->params()->fromPost('composer');     
        $year = (int) $this->params()->fromPost('year');             
        $bitrate = (int) $this->params()->fromPost('bitrate');             
        $sampleRate = (int) $this->params()->fromPost('sampleRate');             
        $channels = (int) $this->params()->fromPost('channels');             
        
    $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('idSong', 'idSong');
        $query = $entityManager->createNativeQuery("call updateTrackinfo(:idSong, :title, :artist, :album, :tags, :albumSort, :size, :ext, :composer, :year, :bitrate, :sampleRate, :channels)", $resultMap);        
        $query->setParameter("idSong", $id);
        $query->setParameter("title", $title, 'string');
        $query->setParameter("artist", $artist, 'string');
        $query->setParameter("album", $album, "string");
        $query->setParameter("tags", $tags, "string");
        $query->setParameter("albumSort", $albumSort);
        $query->setParameter("size", $size);
        $query->setParameter("ext", $ext);
        $query->setParameter("composer", $composer, "string");
        $query->setParameter("year", $year);
        $query->setParameter("bitrate", $bitrate);
        $query->setParameter("sampleRate", $sampleRate);
        $query->setParameter("channels", $channels);
        
        $idSong = (int)$query->execute()[0]["idSong"];        
        
        return new JsonModel([
            'idSong' => $idSong
        ]);
    }
    
    public function writeLogAction() {
        $token = $this->getRequest()->getHeaders('token')->getFieldValue();
        if (!$this->checkToken($token)) {
            return new JsonModel([
                'idSong' => -1
            ]);
        }
        $code = $this->params()->fromPost('code');
        $title = $this->params()->fromPost('title');
        $message = $this->params()->fromPost('message');
        $entityManager = $this->entityManager;
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('id', 'id');
        $resultMap->addScalarResult('code', 'code');
        $resultMap->addScalarResult('title', 'title');
        $resultMap->addScalarResult('message', 'message');
        $query = $entityManager->createNativeQuery("call writeLog(:code, :title, :message)", $resultMap);
        $query->setParameter('code', $code);
        $query->setParameter('title', $title);
        $query->setParameter('message', $message);        
        $result = $query->execute();        
        return new JsonModel([
            'id' => $result->id,
            'code' => $result->code,
            'title' => $result->title,
            'message' => $result->message,
        ]);
    }
    
    public function getBannerAction(){
        $entityManager = $this->entityManager;
        $id = (int) $this->params()->fromQuery('id');
        $ornt = (string) $this->params()->fromQuery('ornt');
        
        $resultMap = new ResultSetMapping($entityManager);
        $resultMap->addScalarResult('id', 'id');
        $resultMap->addScalarResult('imageURL', 'imageURL');
        $resultMap->addScalarResult('targetURL', 'targetURL');
        $query = $entityManager->createNativeQuery("call getBanner(:id, :ornt)", $resultMap);  
        $query->setParameter('id', $id);
        $query->setParameter('ornt', $ornt);
        $data = $query->execute();  
        
        if($id == -1) {
        
            $newId = (int)$data[0]["id"];

            $resultMap1 = new ResultSetMapping($entityManager);
            $query1 = $entityManager->createNativeQuery("call checkAdvRequest(:id)", $resultMap1);  
            $query1->setParameter('id', $newId);
            $query1->execute();  
        }
        
        return new JsonModel($data[0]);
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
