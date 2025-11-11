<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Music\Controller\Factory;

use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Music\Controller\ManageController;

/**
 * Description of MusicControllerFactory
 *
 * @author Developer
 */
class ManageControllerFactory implements FactoryInterface {
    //put your code here
    
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null) {
        $entityManager = $container->get('doctrine.entitymanager.orm_default');        
        return new ManageController($entityManager);
    }
}


