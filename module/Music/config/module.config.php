<?php
namespace Music;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Doctrine\DBAL\Driver\PDOMySql\Driver as PDOMySqlDriver;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;


return [
    'controllers' => [
        'factories' => [
            Controller\MusicController::class => Controller\Factory\MusicControllerFactory::class,   
            Controller\ManageController::class => Controller\Factory\ManageControllerFactory::class,            
        ],
    ],
    'router' => [
        'routes' => [
            'Music' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'List' => [
                'type'    => Segment::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/List[/:filterBy]',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'list',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'Reestr' => [
                'type'    => Segment::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Reestr[/:target][/:filterBy]',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'reestr',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],           
            'getSong' => [
                'type'    => Segment::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/getSong[/:id]',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'getSong',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'getSongList' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/getSongList',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'getSongList',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'Categories' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Categories',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'categories',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'NonStop' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/NonStop',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'nonstop',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'getRandonSong' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/GetRandomSong',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'getRandomSong',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'getCategoryList' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/GetCategoryList',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'getCategoryList',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'addToReport' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/AddToReport',
                    'defaults' => [
                        'controller'    => Controller\MusicController::class,
                        'action'        => 'addToReport',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage/addTrackinfo' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage/AddTrackinfo',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'addTrackinfo',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage/addTrack' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage/AddTrack',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'addTrack',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage/updateTrackinfo' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage/UpdateTrackinfo',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'updateTrackinfo',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage/getGenres' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage/GetGenres',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'getGenres',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/manage/writeLog' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Manage/WriteLog',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'writeLog',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
                ],
            ],
            'music/adv/getBanner' => [
                'type'    => Literal::class,
                'options' => [
                    // Change this to something specific to your module
                    'route'    => '/Music/Adv/GetBanner',
                    'defaults' => [
                        'controller'    => Controller\ManageController::class,
                        'action'        => 'getBanner',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    // You can place additional routes that match under the
                    // route defined above here.
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
            'layout/music-layout'     => __DIR__ . '/../view/layout/music-layout.phtml',
            'music/music/index'       => __DIR__ . '/../view/music/music/index.phtml',            
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml'
            ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => [
            'ViewJsonStrategy',
        ],
    ],
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' => PDOMySqlDriver::class,
                'params' => [
                    'host'     => 'localhost',                    
                    'user'     => 'root',
                    'password' => 'MyNumberIs1997',
                    'dbname'   => 'muzkiosk',
                    'charset'  => 'utf8'
                ]
            ],  
            'orm_statistic' => [
                'driverClass' => PDOMySqlDriver::class,
                'params' => [
                    'host'     => 'localhost',                    
                    'user'     => 'root',
                    'password' => 'MyNumberIs1997',
                    'dbname'   => 'mp3_statistic',
                    'charset'  => 'utf8'
                ]
            ],
        ],
    'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => AnnotationDriver::class,
                'cache' => 'array',
                'paths' => [__DIR__ . '/../src/Entity']
            ],
            'orm_default' => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
                ],
            ],                        
        ],    
    'configuration' =>[
        'orm_default' => [
            'string_functions' =>
                # Match agains should have the path to the MatchAgainst class created in the previous step
                [ 'MATCH_AGAINST' => 'Music\Extensions\Doctrine\ORM\MatchAgainst' ]
            ], 
        'orm_statistic' => [
            'string_functions' =>
                # Match agains should have the path to the MatchAgainst class created in the previous step
                [ 'MATCH_AGAINST' => 'Music\Extensions\Doctrine\ORM\MatchAgainst' ]
            ]
        ],
    ],
];
