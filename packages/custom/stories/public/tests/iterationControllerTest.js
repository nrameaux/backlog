'use strict';

(function() {
    describe('IterationsControllerTest', function() {
        beforeEach(function() {
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        beforeEach(function() {
            module('mean');
            module('mean.system');
            module('mean.users');
            module('mean.stories');
        });

        var IterationCtrl,
            $scope,
            $rootScope,
            $httpBackend;

        beforeEach(inject(function($controller, _$rootScope_, $resource,_$location_, _$httpBackend_) {

            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;

            IterationCtrl = $controller('IterationsController', {
                $scope: $scope
            });

            $httpBackend = _$httpBackend_;
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        function expectGet(file){
            $httpBackend.expectGET(file).respond(200);
        }

        it('should login with a correct user and password', function() {
            $scope.initIterationView();

            var result = [{'version':'G2R2','_id':'55143bb731511a2a538442c4','__v':0},{'version':'G4R2','_id':'55143bd431511a2a538442c5','__v':0}];
            $httpBackend.expectGET('/iterations').respond(200, result);
            expectGet('system/views/index.html');
            $httpBackend.flush();

            expect($scope.iterations.length).toEqual(2);
            expect($scope.iterations[0].version).toEqual('G2R2');
            expect($scope.iterations[1].version).toEqual('G4R2');
        });

        it('should init with correct parameters', function() {
            $scope.initCreate();

            expectGet('system/views/index.html');
            $httpBackend.flush();

            expect($scope.nbIterations).toEqual(12);
            expect($scope.dureeIt).toEqual(2);
        });

        it('should create with unvalid iteration', function() {
            $scope.create(false);

            expectGet('system/views/index.html');
            $httpBackend.flush();
            expect($scope.submitted).toBeTruthy();
        });


        it('should create with valid iteration', function() {
            $scope.version = 'G1R1';
            $scope.create(true);

            $httpBackend.expectPOST('/iterations', '{"version":"G1R1"}').respond(200);
            expectGet('system/views/index.html');
            expectGet('stories/views/iterations.html');
            $httpBackend.flush();

            expect($scope.version).toEqual('');
        });

    });

}());
