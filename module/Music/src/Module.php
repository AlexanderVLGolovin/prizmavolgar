<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonModule for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Music;

use Zend\ModuleManager\ModuleManager;
use Zend\Mvc\MvcEvent;

class Module
{
    const AUDIO_FILES_PATH = '/var/www/prizmavolgar/public/audio/';
    //const VERSION = '3.0.3-dev';
    
    // Метод "init" вызывается при запуске приложения и  
    // позволяет зарегистрировать обработчик событий.
    public function init(ModuleManager $manager)
    {
        // Получаем менеджер событий.
        $eventManager = $manager->getEventManager();
        $sharedEventManager = $eventManager->getSharedManager();
        // Регистрируем метод-обработчик. 
        $sharedEventManager->attach(__NAMESPACE__, 'dispatch', 
                                    [$this, 'onDispatch'], 100);
        $sharedEventManager->attach(__NAMESPACE__, MvcEvent::EVENT_DISPATCH_ERROR,
                                    [$this, 'onError'], 100);
        $sharedEventManager->attach(__NAMESPACE__, MvcEvent::EVENT_RENDER_ERROR, 
                                    [$this, 'onError'], 100);
    }
    // Обработчик события.
    public function onDispatch(MvcEvent $event)
    {
        // Получаем контроллер, к которому был отправлен HTTP-запрос.
        $controller = $event->getTarget();
        // Получаем полностью определенное имя класса контроллера.
        $controllerClass = get_class($controller);
        // Получаем имя модуля контроллера.
        $moduleNamespace = substr($controllerClass, 0, strpos($controllerClass, '\\'));
           
        // Переключаем лэйаут только для контроллеров, принадлежащих нашему модулю.
        if ($moduleNamespace == __NAMESPACE__) {
            $viewModel = $event->getViewModel();
            $viewModel->setTemplate('layout/music-layout');  
        }        
    }
    
    public function onError(MvcEvent $event)
    {
        // Получаем информацию об исключении.
        $exception = $event->getParam('exception');
        if ($exception!=null) {
            $exceptionName = $exception->getMessage();
            $file = $exception->getFile();
            $line = $exception->getLine();
            $stackTrace = $exception->getTraceAsString();
        }
        $errorMessage = $event->getError();
        $controllerName = $event->getController();
        
        // Подготавливаем сообщение эл. почты.
        $to = 'golovin.aleksandr@rambler.ru';
        $subject = 'Your Website Exception';
        
        $body = '';
        if(isset($_SERVER['REQUEST_URI'])) {
            $body .= "Request URI: " . $_SERVER['REQUEST_URI'] . "\n\n";
        }
        $body .= "Controller: $controllerName\n";
        $body .= "Error message: $errorMessage\n";
        if ($exception!=null) {
            $body .= "Exception: $exceptionName\n";
            $body .= "File: $file\n";
            $body .= "Line: $line\n";
            $body .= "Stack trace:\n\n" . $stackTrace;
        }
        
        $body = str_replace("\n", "<br>", $body);
        
        // Посылаем эл. сообщение об ошибке.
        mail($to, $subject, $body);
    }
    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }
}
