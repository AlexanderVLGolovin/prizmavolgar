<?php
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace Music\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity
 * @ORM\Table(name="songsgroups")
 */
class Groups
{
    public function __construct() {
        $this->songs = new ArrayCollection();
    }
    
    /**
     * @ORM\OneToMany(targetEntity="\Music\Entity\SongInfo", mappedBy="songsgroups")
     * @ORM\JoinColumn(name="idGroup", referencedColumnName="idGroup")
     */
    protected $songs;
    
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="idGroup")
     */
    protected $id;
    
    /**     
     * @ORM\Column(name="Name")
     */
    protected $name;
            
    /**
     * @ORM\Column(name="orderBy")
     */
    protected $orderBy;  
    
    /**
     * @ORM\Column(name="state")
     */
    protected $state;  
    
    public function getId()
    {
        return $this->id;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getOrderBy()
    {
        return $this->orderBy;
    }
    
    public function getSongs()
    {
        return $this->songs;
    }
    
    public function getState()
    {
        return $this->state;
    }
}

