/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function nonStopModule() {
    var _self = this;
    this.selectedGroups = [];

    this.start = function (button) {
        _self.getRandomSong();
        $(button).text('Ещё')
                ;
    };
    this.getRandomSong = function () {
        var _selectedItems = _self.selectedGroups.filter(function (_item) {
            return _item.checked === true;
        }).map(function (_item) {
            return _item.id;
        });
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Music/GetRandomSong',
            data: {
                groups: _selectedItems.join()
            },
            success: function (response) {
                if (response.song && response.song.length > 0) {
                    MusicApplication.addToPlayList({
                        id: response.song[0].id,
                        name: response.song[0].name + ' /' + response.song[0].songer + '/',
                        song: response.song[0].name,
                        songer: response.song[0].songer,
                        album: response.song[0].album
                    });
                    MusicApplication.playNextFromList();
                }
            },
            error: function (e, err) {
                console.error(err);
            }
        });
    };
}
;

