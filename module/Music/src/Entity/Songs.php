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
 * @ORM\Table(name="songs")
 */
class Songs {
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="idSong")
     */
    protected $id;
    
    /**     
     * @ORM\Column(name="data")
     */
    protected $song;
    
    public function getSong(){
        return $this->song;
    }
}
