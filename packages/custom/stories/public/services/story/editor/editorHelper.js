'use strict';

angular.module('mean.stories').factory('EditorHelper', ['$http', '$q', '$state', function() {
        var EditorHelper = {};

    /**
     * Retourne l'ensemble des options d'édition classique.
     */
    EditorHelper.editorOptions = function () {
        return {
            language : 'fr',
            'skin': 'moono',
            toolbarLocation: 'top',
            toolbar: 'full',
            toolbar_full: [
                { name: 'basicstyles',
                    items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                { name: 'links', items: [ 'Link' ] },
                { name: 'tools', items: [ 'SpellChecker'] },
                { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                { name: 'styles', items: [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },'/',
            ],
            height : 250
        };
    };


    /**
     * Retourne l'ensemble des options d'édition pour les fitness (liens).
     */
    EditorHelper.editorOptionsFitness = function () {
        return {
            language : 'fr',
            'skin': 'moono',
            toolbarLocation: 'top',
            toolbar: 'full',
            toolbar_full: [
                { name: 'links', items: [ 'Link' ] },
                { name: 'basicstyles',
                    items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },'/',
            ],
            height : 150
        };
    };

    return EditorHelper;
}]);

