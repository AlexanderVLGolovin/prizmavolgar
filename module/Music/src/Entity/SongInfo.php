<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Music\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Description of SongInfo *
 * @author Developer
 * 
 * @ORM\Entity
 * @ORM\Table(name="muzkiosk.songinfo")
 */
class SongInfo {
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="idSong")
     */
    protected $id;
    
    /**
     * @ORM\Column(name="idGroup")
     */
    protected $idGroup;
    
    /**
     * @ORM\Column(name="Name")
     */
    protected $name;
    
     /**
     * @ORM\Column(name="Songer")
     */
    protected $songer;
    
     /**
     * @ORM\Column(name="Album")
     */
    protected $album;
    
     /**
     * @ORM\Column(name="songYear")
     */
    protected $songYear;
    
     /**
     * @ORM\Column(name="fileSize")
     */
    protected $fileSize;
    
     /**
     * @ORM\Column(name="UID")
     */
    protected $uid;
    
     /**
     * @ORM\Column(name="alternativeSonger")
     */
    protected $alternativeSonger;
    
     /**
     * @ORM\Column(name="createDate")
     */
    protected $createDate;
    
     /**
     * @ORM\Column(name="state")
     */
    protected $state;

    /**
     * @ORM\Column(name="bitrate")
     */
    protected $bitrate;
    
    /**
     * @ORM\Column(name="albumSort")
     */
    protected $albumSort;
    
    /**
     * @ORM\Column(name="title")
     */
    protected $title;
    
    /**
     * @ORM\Column(name="artist")
     */
    protected $artist;
    
    /**
     * @ORM\Column(name="album2")
     */
    protected $album2;
    
    /**
     * @ORM\Column(name="liricist")
     */
    protected $liricist;
    
    /**
     * @ORM\Column(name="ext")
     */
    protected $ext;
    
    
    
    public function getId()
    {
        return $this->id;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
    public function getSonger()
    {
        return $this->songer;
    }
    
    public function getAlbum()
    {
        return $this->album;
    }
    
    public function getSongYear()
    {
        return $this->songYear;
    }
    
    public function getFileSize()
    {
        return $this->fileSize;
    }
    
    public function getAutor()
    {
        return $this->autor;
    }
            
    public function getUID()
    {
        return $this->uid;        
    }
    
    public function getAlternativeSonger()
    {
        return $this->alternativeSonger;
    }
    
    public function getCreateDate()
    {
        return $this->createDate;
    }
    
    public function getIdGroup()
    {
        return $this->idGroup;
    }
    
    public function setIdGroup($idGroup)
    {
        return $this->idGroup = $idGroup;
    }
    
    public function getState()
    {
        return $this->state;
    }
    
    public function setState($state)
    {
        return $this->state = $state;
    }
    
    public function getBitrate()
    {
        return $this-> bitrate;
    }
    
    public function setBitrate($bitrate)
    {
        return $this->birate = $bitrate;
    }
    
        public function getAlbumSort()
    {
        return $this-> albumSort;
    }
    
    public function setAlbumSort($albumSort)
    {
        return $this->albumSort = $albumSort;
    }
    
    public function getTitle()
    {
        return $this-> title;
    }
    
    public function setTitle($title)
    {
        return $this->title = $title;
    }

    public function getArtist()
    {
        return $this-> artist;
    }
    
    public function setArtist($artist)
    {
        return $this->artistt = $artist;
    }
    
    public function getAlbum2()
    {
        return $this-> album2;
    }
    
    public function setAlbum2($album2)
    {
        return $this->album2 = $album2;
    }
    
    public function getLiricist()
    {
        return $this-> liricist;
    }
    
    public function setLiricist($liricist)
    {
        return $this->liricist= $liricist;
    }
    
    public function getExt()
    {
        return $this-> ext;
    }
    
    public function setExt($ext)
    {
        return $this->ext= $ext;
    }

}

