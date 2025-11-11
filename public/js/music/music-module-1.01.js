/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function musicModule() {

    this.mode = 'stop'; //'stop' | play | pause
    this.isRepeat = false;
    this.currentTime = 0;
    this.rotorDeg = 0;
    this.player = null;
    var _self = this;


    this.openStore = function () {

        let store = indexedDB.open("musicstore", 11);

        store.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains('playList')) {
                db.createObjectStore('playList', {keyPath: "idx"});
            }
            if (!db.objectStoreNames.contains('selectedItem')) {
                db.createObjectStore('selectedItem', {keyPath: "selectedId"});
            }
        }

        store.onsuccess = function (event) {
            _self.db = event.target.result;
            _self.getPlayList();
        }
    }

    this.openStore();

    this.constructor.prototype._setMode = function (mode) {
        this.mode = mode;
        switch (mode) {
            case 'stop':
            case 'pause':
                $('#player .pause').addClass('disabled');
                $('#player .stop').addClass('disabled');
                $('#player .fast-backward').addClass('disabled');
                $('#player .fast-forward').addClass('disabled');
                $('.repeat-playlist').addClass('disabled');
                $('#player .play').removeClass('disabled');
                if (mode === 'stop') {
                    $('.display-area .mode-disp').text('STOP');
                    _self.currentTime = 0;
                }
                if (mode === 'pause')
                    $('.display-area .mode-disp').text('PAUSE');
                break;
            case 'play':
                $('#player .pause').removeClass('disabled');
                $('#player .stop').removeClass('disabled');
                $('#player .fast-backward').removeClass('disabled');
                $('#player .fast-forward').removeClass('disabled');
                $('.repeat-playlist').removeClass('disabled');
                $('#player .play').addClass('disabled');

                $('.display-area .mode-disp').text('PLAY');
                break;
        }
    };

    this.constructor.prototype._createPalyer = function () {
        _self.player = new playModule({
            onAudioProcess: function (e) {
                if (_self.leftIndicator) {
                    _self.leftIndicator.beginUpdate();
                    _self.leftIndicator.value(e.leftDecibels);
                    _self.leftIndicator.endUpdate();
                }
                if (_self.rightIndicator) {
                    _self.rightIndicator.beginUpdate();
                    _self.rightIndicator.value(e.rightDecibels);
                    _self.rightIndicator.endUpdate();
                }

                switch (_self.mode) {
                    case 'stop':
                        _self.currentTime = 0;
                        $('.display-area .timer-disp').text('');
                        $('.display-area .song').text('');
                        $('.display-area .songer').text('');
                        $('.display-area .album').text('');
                        break;
                    case 'play':
                        //_self.currentTime = e.currentTime;
                        $('.display-area .timer-disp').text(secondsToTimeString(_self.currentTime) +
                                (_self.player.time ? "(" + secondsToTimeString(_self.player.time) + ")" : ''));

                        _self.rotorDeg -= 2;
                        if (_self.rotorDeg == -360)
                            _self.rotorDeg = 0;
                        $('.cassete-rotor.left img').css('transform', 'rotate(' + _self.rotorDeg + 'deg)');
                        $('.cassete-rotor.right img').css('transform', 'rotate(' + _self.rotorDeg + 'deg)');

                        break;
                }
            },
            onEnded: function (e) {
                _self._setMode('stop');
                _self.currentTime = 0;
                _self.playNext();
            },
            onStop: function (e) {
                _self._setMode('stop');

            },
            onPause: function (e) {
                _self._setMode('pause');
            },
            onPlay: function (e) {
                _self._setMode('play');
            }
        });
    }

    this.getCategoryLayout = function () {
        $.ajax({
            url: '/Music/Categories',
            type: 'GET',
            dataType: 'HTML',
            success: function (layout) {
                $('#mainContent')
                        .off()
                        .empty()
                        .html(layout);
            },
            error: function (e) {
                console.error(e);
            }
        });
    };

    this.getNonStopLayout = function () {
        $.ajax({
            url: '/Music/NonStop',
            type: 'GET',
            dataType: 'HTML',
            success: function (layout) {
                $('#mainContent')
                        .off()
                        .empty()
                        .html(layout);
            },
            error: function (e) {
                console.error(e);
            }
        });
    };

    this.getSongListLayout = function (filterBy, criteria) {

        $.ajax({
            url: '/Music/List/' + filterBy,
            type: 'POST',
            data: {criteria: btoaencode(criteria)},
            dataType: 'HTML',
            success: function (layout) {
                $('#mainContent')
                        .off()
                        .empty()
                        .html(layout);
            },
            error: function (e) {
                console.error(e);
            }
        });
    };

    this.renderSongList = function (filterBy, criteria) {
        this.filterBy = filterBy;
        this.criteria = criteria;
        $('#SongList').dxDataGrid({
            columns: [
                {
                    dataField: 'name',
                    caption: 'Наименование'
                },
                {
                    dataField: 'songer',
                    caption: 'Исполнитель',
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement.html($('<a />')
                                .text(cellInfo.text)
                                .attr('href', 'javascript: MusicApplication.updateSongList("bySonger", "' + cellInfo.text + '")'));
                    }
                },
                {
                    dataField: 'album',
                    caption: 'Альбом',
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement.html($('<a />')
                                .text(cellInfo.text)
                                .attr('href', 'javascript: MusicApplication.updateSongList("byAlbum", "' + cellInfo.text + '")'));
                    }
                },
                {
                    dataField: 'toPlay',
                    caption: '',
                    allowSorting: false,
                    allowHeaderFiltering: false,
                    alignment: 'center',
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement
                                .append($('<div />').addClass('u-pointer u-nowrap')
                                        .append($('<i />').addClass('fa fa-play').attr('title', 'Play'))
                                        .on('click', function (e) {
                                            MusicApplication.play('/Music/getSong/' + cellInfo.data.id,
                                                    cellInfo.data.name,
                                                    cellInfo.data.songer,
                                                    cellInfo.data.album);
                                        }));
                    }
                },
                {
                    dataField: 'downLoad',
                    caption: '',
                    allowSorting: false,
                    visible: true,
                    allowHeaderFiltering: false,
                    alignment: 'center',
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement
                                .append('<a title="Download" class="u-pointer u-nowrap" download href="/Music/getSong/' +
                                        cellInfo.data.id + '"><i class ="fa fa-download"></i></a>');
                    }
                },
                {
                    dataField: 'toPlayList',
                    caption: '',
                    allowSorting: false,
                    allowHeaderFiltering: false,
                    alignment: 'center',
                    headerCellTemplate: function (columnHeader, headerInfo) {
                        columnHeader.append($('<div />').addClass('u-pointer u-nowrap')
                                .append($('<i />').addClass('fa fa-list').attr('title', 'Add to playlist'))
                                .on('click', function (e) {
                                    MusicApplication.startBegunok(columnHeader);
                                    var _items = headerInfo.component.getController('data').items();
                                    _items.forEach(function (_item) {
                                        MusicApplication.addToPlayList({
                                            id: _item.data.id,
                                            name: _item.data.name + (_item.data.songer ? ' /' + _item.data.songer + '/' : ''),
                                            song: _item.data.name,
                                            songer: _item.data.songer || '',
                                            album: _item.data.album || ''
                                        });
                                    });

                                }));
                    },
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement.append($('<div />').addClass('u-pointer u-nowrap')
                                .append($('<i />').addClass('fa fa-list').attr('title', 'Add to playlist'))
                                .on('click', function (e) {
                                    MusicApplication.startBegunok(cellElement);
                                    MusicApplication.addToPlayList({
                                        id: cellInfo.data.id,
                                        name: cellInfo.data.name + (cellInfo.data.songer ? ' /' + cellInfo.data.songer + '/' : ''),
                                        song: cellInfo.data.name,
                                        songer: cellInfo.data.songer || '',
                                        album: cellInfo.data.album || ''
                                    });
                                }));
                    }
                },
                {
                    dataField: 'year',
                    caption: 'Год',
                    format: {type: 'year'}
                },
                {
                    dataField: 'fileSize',
                    caption: 'Размер Файла',
                    alignment: 'center',
                    cellTemplate: function (cellElement, cellInfo) {
                        cellElement.text(cellInfo.text + 'Mb');
                    }
                }
            ],
            columnAutoWidth: true,
            allowColumnResizing: true,
            columnHidingEnabled: true,
            wordWrapEnabled: true,
            headerFilter: {
                visible: false,
                texts: {
                    cancel: 'Отмена',
                    emptyValue: 'Очистить'
                }
            },
            sorting: {
                ascendingText: 'Сортировать по возрастанию',
                clearText: 'Очистить',
                descendingText: 'Сортировка по убыванию',
                mode: 'multiple'
            },
            remoteOperations: {
                filtering: true,
                paging: true,
                sorting: true
            },
            pager: {
                infoText: 'Стр. {0} из {1}({2} страниц)',
                showNavigationButtons: true,
                showPageSizeSelector: true
            },
            userData: {filterBy: filterBy, criteria: criteria},
            dataSource: new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    var d = new $.Deferred();
                    loadOptions.filterBy = MusicApplication.filterBy;
                    loadOptions.criteria = btoaencode(MusicApplication.criteria);
                    $.ajax({
                        url: '/Music/getSongList',
                        type: 'POST',
                        dataType: 'JSON',
                        data: loadOptions,
                        success: function (data) {
                            d.resolve({data: data.data, totalCount: data.total});
                        },
                        error: function (e) {
                            console.error(e.stack);
                        }
                    });
                    return d;
                }
            })
        });
    };

    this.updateSongList = function (filterBy, criteria) {
        this.filterBy = filterBy;
        this.criteria = criteria;
        var _dataGrid = $('#SongList').dxDataGrid('instance');
        if (_dataGrid)
            _dataGrid.refresh();
    };

    this.getReestr = function (target, criteria) {
        var _url = (target === 'Songers' ? '/Music/Reestr/Songers/byChar' : '/Music/Reestr/Albums/byChar');
        $.ajax({
            url: _url,
            type: 'GET',
            data: {criteria: btoaencode(criteria)},
            dataType: 'HTML',
            success: function (layout) {
                $('#mainContent')
                        .off()
                        .empty()
                        .html(layout);
            },
            error: function (e) {
                console.error(e);
            }
        });
    };

    this.play = function (path, song, songer, album) {
        if (_self.player === null)
            _self._createPalyer();
        if (path) {
            _self.currentTime = 0;
            _self.player.play(path);
            $('.display-area .song').text(song || '');
            $('.display-area .songer').text(songer || '');
            $('.display-area .album').text(album || '');
        } else {
            if (_self.currentTime > 0) {
                if (_self.player)
                    _self.player.play();
            } else {
                if (_self.playListControl) {
                    var _items = _self.playListControl.option('items');
                    var _selectedItems = _self.playListControl.option('selectedItems');

                    if (_items.length > 0) {
                        if (_selectedItems.length === 0) {
                            _self.playListControl.selectItem(0);
                            $('.display-area .song').text(_items[0].song);
                            $('.display-area .songer').text(_items[0].songer);
                            $('.display-area .songer').text(_items[0].album);
                            _self.currentTime = 0;
                            _self.player.play('/Music/getSong/' + _items[0].id);
                        } else {
                            $('.display-area .song').text(_selectedItems[0].song);
                            $('.display-area .songer').text(_selectedItems[0].songer);
                            $('.display-area .album').text(_selectedItems[0].album);
                            _self.currentTime = 0;
                            _self.player.play('/Music/getSong/' + _selectedItems[0].id);
                        }
                    }
                }
            }
        }
    };

    this.playNextFromList = function () {
        if (_self.playListControl) {
            var _selectedItems = _self.playListControl.option('selectedItems');

            if (_selectedItems.length === 0) {
                _self.play();
                return true;
            }

            var _items = _self.playListControl.option('items');
            var _selectedIndex = undefined;
            var _itemCount = 0;
            var _selectedItem = _items.find(function (_item, _index, _all) {
                var _this = _item.id === _selectedItems[0].id;
                if (_this === true) {
                    _selectedIndex = _index;
                    _itemCount = _all;
                }
                return _this;
            });
            if (_selectedItem && _selectedIndex < (_itemCount.length - 1)) {
                _self.playListControl.selectItem(++_selectedIndex);
                var _nextItem = _self.playListControl.option('selectedItems');
                _self.player.play('/Music/getSong/' + _nextItem[0].id,
                        _nextItem[0].name);
                return true;
            } else {
                if (_self.page !== 'nonstop' && $('.repeat-playlist').hasClass('active')) {
                    _self.playListControl.selectItem(0);
                    _self.player.play('/Music/getSong/' + _items[0].id,
                            _items[0].name);
                    return true;
                }
            }

            return false;
        }
        return false;
    };

    this.playNext = function () {
        var _ifFromList = _self.playNextFromList();
        if (_self.page === 'nonstop' && _self.nonStopModule && _ifFromList === false)
            _self.nonStopModule.getRandomSong();
    };

    this.playPrior = function () {
        if (_self.playListControl) {
            var _selectedItems = _self.playListControl.option('selectedItems');

            if (_selectedItems.length > 0) {
                var _items = _self.playListControl.option('items');
                var _selectedIndex = undefined;
                var _selectedItem = _items.find(function (_item, _index, _all) {
                    var _this = _item.id === _selectedItems[0].id;
                    if (_this === true) {
                        _selectedIndex = _index;
                    }
                    return _this;
                });

                if (_selectedItem && _selectedIndex > 0) {
                    _self.playListControl.selectItem(--_selectedIndex);
                    var _priorItem = _self.playListControl.option('selectedItems');
                    _self.player.play('/Music/getSong/' + _priorItem[0].id,
                            _priorItem[0].name);
                    return true;
                }
            }
        }
    };

    this.addToPlayList = function (item) {
        if (_self.playListControl) {
            var _items = _self.playListControl.option('items');
            if (!_items)
                _items = [];
            _items.push(item);
            _self.playListControl.option('items', _items);
            if (!_self.mode)
                _self._setMode('stop');
        }
    };

    this.clearPlayList = function () {
        if (_self.playListControl) {
            _self.playListControl.option('items', []);
        }
    };

    this.toggleRepeat = function () {
        if ($('.repeat-playlist').hasClass('active'))
            $('.repeat-playlist').removeClass('active');
        else
            $('.repeat-playlist').addClass('active');

    };

    this.startBegunok = function ($startElement) {

        var _begunokOffset = $startElement.offset();
        var currentPosition = {
            top: _begunokOffset.top,
            left: _begunokOffset.left + $startElement.width()
        };

        var _playListOffset = $('div#playList').offset();

        var finishPosition = {
            top: _playListOffset.top + $('div#playList').height() / 2,
            left: _playListOffset.left
        };

        $('div.list-load-begunok')
                .css({top: currentPosition.top, left: currentPosition.left})
                .removeClass('u-hidden');

        var _interval = setInterval(function () {

            currentPosition.top = currentPosition.top - 3;

            $('div.list-load-begunok')
                    .css({top: currentPosition.top});

            if (currentPosition.top < finishPosition.top) {
                clearInterval(_interval);
                $('div.list-load-begunok').addClass('u-hidden');
            }
        }, 1);

    }

    this.savePlayList = function () {

        let _save = function () {

            let items = _self.playListControl.option('items');
            let transaction = _self.db.transaction("playList", "readwrite");
            let idx = 0;
            
            if(items.length === 0) {
                _self.clearSelectedItem();
                return;
            }

            items.map((item) => {
                item.idx = idx++;
                let request = transaction.objectStore("playList").put(item);
                request.onerror = function (e) {
                    console.error(e);
                }
            });

            transaction.onabort = function (e) {
                console.error("Ошибка", transaction.error);
            }
        }

        let _clear = function () {
            let transaction = this.db.transaction("playList", "readwrite");
            let request = transaction.objectStore('playList').clear();
            request.onsuccess = function () {
                _save();
            }
        }

        setTimeout(_clear.bind(this));
    };

    this.getPlayList = function () {
        let transaction = this.db.transaction(['playList'], 'readonly');
        let store = transaction.objectStore('playList');

        let request = store.getAll();

        request.onsuccess = function () {
            if (_self.playListControl) {
                _self.playListControl.option('items', request.result);
                _self.getSelectedItem();
            }
        }
    };

    this.saveSelectedItem = function () {
        let index = this.playListControl.option('selectedIndex');

        if (!index >= 0)
            this.clearSelectedItem();

        let item = {selectedId: 1, id: index};
        let transaction = _self.db.transaction("selectedItem", "readwrite");

        let request = transaction.objectStore("selectedItem").put(item);
        request.onerror = function (e) {
            console.error(e);
        }

        transaction.onabort = function () {
            console.error("Ошибка", transaction.error);
        }
    }

    this.getSelectedItem = function () {
        let transaction = _self.db.transaction(['selectedItem'], 'readonly');
        let store = transaction.objectStore('selectedItem');

        let request = store.get(0);

        request.onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                if (_self.playListControl) {
                    _self.playListControl.option('noPlay', true);
                    _self.playListControl.option('selectedIndex', cursor.id);
                }
            }
        }
    }

    this.clearSelectedItem = function () {
        let index = this.playListControl.option('selectedIndex');

        let item = {idx: 1, id: index};
        let transaction = _self.db.transaction("selectedItem", "readwrite");

        let request = transaction.objectStore("selectedItem").clear();

        request.onerror = function (e) {
            console.error(e);
        };

        transaction.onabort = function () {
            console.error("Ошибка", transaction.error);
        };
    }
}


function reestr(target, filterBy, criteria) {
    this.target = target;
    this.criteria = criteria;
    this.filterBy = filterBy;

    this.getTargetValue = function () {
        switch (this.target) {
            case 'Songers':
                return 'I';
            case 'Albums':
                return 'A';
            default:
                return 'S';
        }
    };
}

function btoaencode(str) {
    return window.btoa(
            encodeURIComponent(str)
            .replace(/%([0-9A-F]{2})/g,
                    function (match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }
            )
            );
}
;

function secondsToTimeString(seconds) {
    var _time = Math.floor(seconds);
    var _mins = Math.floor(_time / 60);
    var _secs = _time - (_mins * 60);
    return _mins + ':' + (_secs < 10 ? '0' + _secs : _secs);
}

var MusicApplication = null;

try {
    $(function () {
        MusicApplication = new musicModule();

        $('#SelectSearchType').dxRadioGroup({
            layout: 'horizontal',
            items: [{
                    value: 'S',
                    text: 'Песню'
                },
                {
                    value: 'A',
                    text: 'Альбом'
                },
                {
                    value: 'I',
                    text: 'Исполнителя'
                }],
            value: 'S',
            valueExpr: 'value'
        });
        $('#SearchTextBox').dxTextBox({
            mode: 'search',
            width: '400px',
            showClearButton: true,
            placeholder: 'Поиск по сайту...',
            onValueChanged: function (e) {
                if (e.value.length > 0)
                    MusicApplication.getSongListLayout('byText', e.value);
            }
        });

        $('.search-letters span').on('click', function (e) {
            var _target = $('#SelectSearchType').dxRadioGroup('instance').option('value');
            switch (_target) {
                case 'S':
                    MusicApplication.getSongListLayout('byChar', $(e.target).text());
                    break;
                case 'I':
                    MusicApplication.getReestr('Songers', $(e.target).text());
                    break;
                case 'A':
                    MusicApplication.getReestr('Albums', $(e.target).text());
                    break;
            }
        });

        //player initialization
        $('#player .pause').on('click', function () {
            MusicApplication.player.pause();
        });
        $('#player .stop').on('click', function () {
            MusicApplication.player.stop();
        });
        $('#player .play').on('click', function () {
            MusicApplication.play();
        });
        $('#player .fast-forward').on('click', function () {
            MusicApplication.playNext();
        });
        $('#player .fast-backward').on('click', function () {
            MusicApplication.playPrior();
        });
        $('.repeat-playlist').on('click', function () {
            MusicApplication.toggleRepeat();
        });

        $('.play-playlist').on('click', function () {
            MusicApplication.play();
        });

        $('.clear-playlist').on('click', function () {
            MusicApplication.clearPlayList();
        });

        var _gaugeOptions = {
            animation: {
                duration: 500,
                easing: 'easeOutCubic',
                enabled: true
            },
            geometry: {startAngle: 135, endAngle: 50},
            size: {width: 250, height: 130},
//            title: {
//                text: 'dB',  
//                verticalAlignment: "top",
//                font: {
//                    size: 9,
//                    color: '#fff'
//                }                
//            },
            scale: {
                label: {
                    visible: false,
                    useRangeColors: true,
                    indentFromTick: 2,
                    format: 'decimal',
                    font: {
                        size: 9
                    }
                },
                tick: {
                    //color: 'black',
                    length: 10,
                    width: 1,
                    visible: false
                },
                allowDecimals: false,
                startValue: -20,
                endValue: 10,
                orientation: 'outside',
                customTicks: [-20, -7, -4, -2, 0, 2, 10],
                minorTick: {
                    length: 5,
                    color: 'red',
                    width: 1,
                    visible: false
                },
                customMinorTicks: [-9.5, -8.5, -6.5, -5., -3.5, -1.5, 2.5, 4.5]
            },
            valueIndicator: {
                type: 'RectangleNeedle',
                width: 2,
                offset: 0
            },
            rangeContainer: {
                offset: 0,
                ranges: [
                    {startValue: -20, endValue: 10, color: "transparent"},
                            //        {startValue: -10, endValue: -2, color: "green"},
                            //        {startValue: -2, endValue: -.01, color: "#FFc100"},
                            //        {startValue: -.01, endValue: 5, color: "red"}
                ]
            },
            value: -20
        };

        MusicApplication.leftIndicator = $('#leftIndicator').dxCircularGauge(_gaugeOptions).dxCircularGauge('instance');
        MusicApplication.rightIndicator = $('#rightIndicator').dxCircularGauge($.extend(true, {}, _gaugeOptions)).dxCircularGauge('instance');

        //playlist
        MusicApplication.playListControl = $('#playList').dxList({
            elementAttr: {class: 'play-list-control'},
            noDataText: '',
            height: 118,
            selectionMode: 'single',
            onOptionChanged: function (e) {
                if (e.component.option('items') && e.component.option('items').length > 0) {
                    $('.player-area .fa').removeClass('disabled');
                } else {
                    $('.player-area .fa').addClass('disabled');
                }
                if (e.name == 'items')
                    MusicApplication.savePlayList();
            },
            onSelectionChanged: function (e) {
                if (e.addedItems.length > 0) {
                    MusicApplication.saveSelectedItem();
                    const noPlay = e.component.option('noPlay');

                    if (noPlay == true) {
                        e.component.option('noPlay', false);
                    } else {

                        MusicApplication.play('/Music/getSong/' + e.addedItems[0].id,
                                e.addedItems[0].song,
                                e.addedItems[0].songer,
                                e.addedItems[0].album);
                    }
                }
            },
            itemTemplate: function (itemData, itemIndex, itemElement) {
                itemElement
                        .append($('<div />')
                                .addClass('song-title')
                                .html($('<span />')
                                        .addClass('ellipsis-one-line')
                                        .text(itemData.name)))
                        .append(($('<div />')
                                .addClass('fa fa-trash-o u-floatRight u-pointer')
                                .css('padding', '0 0 0 .5em')
                                .html('&nbsp;')
                                .on('click', function (e) {
                                    e.stopPropagation();
                                    MusicApplication.playListControl.deleteItem(itemElement.parents('.dx-item.dx-list-item')[0]);
                                })
                                )
                                );
            }
        }).dxList('instance');

        //play counter
        setInterval(function () {
            if (MusicApplication.mode === 'play' && MusicApplication.player && MusicApplication.player.audio && !MusicApplication.player.audio.paused)
                ++MusicApplication.currentTime;
        }, 1000);

    });
} catch (_error) {
    console.error(_error);
}
