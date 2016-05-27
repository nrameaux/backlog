'use strict';

(function() {
    describe('LotsControllerTest', function() {
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

        var LotCtrl,
            $scope,
            $rootScope,
            $httpBackend,
            $state;


        beforeEach(inject(function($controller, _$rootScope_, $resource,_$location_, _$state_,_$httpBackend_) {
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
            $state = _$state_;

            LotCtrl = $controller('LotsController', {
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

        it('should init lot view', function() {
            $scope.initLotView();
            var result = [{'name':'lot1'},{'name':'lot2'}];
            $httpBackend.expectGET('/lots').respond(200, result);
            expectGet('system/views/index.html');
            $httpBackend.flush();

            expect($scope.lots.length).toEqual(2);
            expect($scope.lots[1].name).toEqual(result[1].name);
        });

        it('should init lot creation', function() {
            $scope.initCreate();

            var result = [{'name':'lot1'},{'name':'lot2'}];
            $httpBackend.expectGET('/lots').respond(200, result);
            expectGet('system/views/index.html');
            $httpBackend.flush();

            expect($scope.lots.length).toEqual(2);
            expect($scope.lots[1].name).toEqual(result[1].name);
        });

        it('should create with unvalid lot', function() {
            $scope.create(false);

            expectGet('system/views/index.html');
            $httpBackend.flush();
            expect($scope.submitted).toBeTruthy();
        });


        it('should create with valid lot', function() {
            $scope.name = 'name';
            $scope.description = 'description';
            $scope.create(true);
            //spyOn($state, 'go');

            var result = { _id  : 'salut'};

            $httpBackend.expectPOST('/lots', '{"name":"name","description":"description"}').respond(200, result);
            expectGet('system/views/index.html');
            $httpBackend.expectGET('stories/views/viewLot.html').respond();
            $httpBackend.flush();
            // expect($state.go).toHaveBeenCalled();//With('lot by id', { lotId : result._id });

        });
    });

}());
