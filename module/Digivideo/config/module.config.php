<?php
namespace Digivideo;

use Zend\Router\Http\Literal;
use Zend\ServiceManager\Factory\InvokableFactory;


return [
    'controllers' => [
        'factories' => [
            Controller\DigivideoController::class => InvokableFactory::class,        
        ],
    ],
    'router' => [
        'routes' => [
            'Digivideo' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Digivideo',
                    'defaults' => [
                        'controller'    => Controller\DigivideoController::class,
                        'action'        => 'index',
                    ],
                ],                
            ],            
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            //'layout/layout'           => __DIR__ . '/../../Application/view/layout/layout.phtml',
            //'digivideo/index'         => __DIR__ . '/../view/digivideo/index.phtml',
            'error/404'               => __DIR__ . '/../../Application/view/error/404.phtml',
            'error/index'             => __DIR__ . '/../../Application/view/error/index.phtml',
            ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],        
    ],    
];
