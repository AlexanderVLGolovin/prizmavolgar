/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Analyzer() {

    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext ||
                window.mozAudioContext ||
                window.oAudioContext ||
                window.msAudioContext;

        this.context = new AudioContext();
        this.node = this.context.createScriptProcessor(256);
        this.analyser = this.context.createAnalyser();
        this.analyser.smoothingTimeConstant = .9;
        this.analyser.fftSize = 512;

        this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    } catch (error)
    {
        console.error(error);
    }
}

function playModule(options) {
    this.settings = {
        onAudioProcess: function () {},
        onEnded: function () {},
        onPlay: function () {},
        onErrorLoaded: function () {},
        onLoadedMetadata: function () {},
        onStop: function () {},
        onPause: function () {}
    };

    this.settings = $.extend(true, this.settings, options);
    this.processedLastTime = new Date();
    this.startTime = 0;

    var _self = this;   
    

    try {        
        _self.audio = new Audio();
        _self.analyser = new Analyzer();
        //отправляем на обработку в  AudioContext 
        _self.analyser.source = _self.analyser.context.createMediaElementSource(_self.audio);
        //связываем источник и анализатором
        _self.analyser.source.connect(_self.analyser.analyser);
        //связываем анализатор с интерфейсом, из которого он будет получать данные
        _self.analyser.analyser.connect(_self.analyser.node);
        //Связываем все с выходом
        _self.analyser.node.connect(_self.analyser.context.destination);
        _self.analyser.source.connect(_self.analyser.context.destination);
        _self.analyser.node.connect(_self.analyser.context.destination);
        //подписываемся на событие изменения входных данных
        _self.analyser.node.onaudioprocess = function (evt) {
            var _currentTime = new Date();
            if ((_currentTime - _self.processedLastTime) > 40) {
                var leftRms = -20, rightRms = -20;
                if (!_self.audio.paused) {
                    //get 0 chanel data
                    input = evt.inputBuffer.getChannelData(0);
                    var len = 256, total = 0, i = 0;
                    while (i < len)
                        total = Math.max(Math.abs(input[i++]), total);
                    leftRms = Math.log10(total) * 10;
                    //get 1 chanel data
                    input = evt.inputBuffer.getChannelData(1);
                    //len = input.length;
                    total = 0;
                    i = 0;
                    while (i < len)
                        total = Math.max(Math.abs(input[i++]), total);
                    rightRms = Math.log10(total) * 10;
                }

                _self.processedLastTime = _currentTime;
                _self.settings.onAudioProcess({
                    leftDecibels: leftRms,
                    rightDecibels: rightRms,
                    currentTime: _self.analyser.analyser.context.currentTime - _self.startTime,
                    state: _self.analyser.analyser.context.state
                });
            }
        };
    } catch (error) {
        $('.main-page').append($('<div \>')
                .css({position: 'fixed',                    
                    marginLeft: 'calc(50% - 200px)',
                    textAlign: 'center',
                    width: '400px',
                    padding: '1em 2em',
                    color: 'red',
                    top: '10px',
                    backgroundColor: 'blue'})
                .text(error.message));
    }

    this.audio.addEventListener('loadeddata', function (e) {
        _self.loadedData(e);
    }, false);
    this.audio.addEventListener('error', function (e) {
        _self.errorLoaded(e);
    }, false);
    this.audio.addEventListener('ended', function (e) {
        _self.onEnded(e);
    }, false);
    this.audio.addEventListener('error', function (e) {
        _self.errorLoaded(e);
    }, false);
    this.audio.addEventListener('loadedmetadata', function (e) {
        _self.loadedMetadata(e);
    });

    //check if player can play that type
    this.constructor.prototype._canPlayType = function (playType) {
        var _result = this.audio.canPlayType(playType);
        switch (_result) {
            case 'probably':
            case 'maybe':
                return true;
            default:
                return false;
        }
    };

    this.loadedData = function (e) {
        if(this.audio.play){
            this.startTime = this.analyser.context.currentTime;
            this.audio.play();
            this.settings.onPlay(this);   
        }        
    };

    this.errorLoaded = function (e) {
        this.settings.onErrorLoaded(e);
    };

    this.onEnded = function (e) {
        this.settings.onEnded(e);
    };

    this.loadedMetadata = function (e) {
        this.time = this.audio.duration;
        this.settings.onLoadedMetadata(e);
    };

    this.play = function (path) {
        if (path) {
            this.audio.src = path;
        } else
            this.audio.play();
        this.settings.onPlay(this);
    };

    this.stop = function () {
        this.audio.pause();
        this.settings.onStop(this);
    };

    this.pause = function () {
        this.audio.pause();
        this.settings.onPause(this);
    };

    this.goTo = function (gotoTime) {
        this.audio.currentTime = gotoTime;
    };
}

