 crt = angular.module('App', ['ngRoute']);
  crt.config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {
    'gumgaToken': 'fafiman'
  };

    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
        controller: 'AppController'
      })
      .when('/votar/:enqueteId', {
        templateUrl: 'desc.html',
        controller: 'DescCtrl'
      })
      .when('/criar/', {
        templateUrl: 'criar.html',
        controller: 'CriarCtrl'
      })
      .otherwise('/');

  });

  crt.controller('AppController', ['$scope','$http', function($scope,$http) {
    $scope.listarEnquetes = function() {
      $http.get('https://munif.com.br/encatman-api/api/enquete?gumgaToken=fafiman').then(function(response) {
          $scope.enquetes = response.data;
      });
    }
    $scope.listarEnquetes();


  }]);

  crt.controller('DescCtrl', ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    $scope.desc_enquete={};
    $scope.status="Você ainda não votou !";
    $scope.votou=false;

    $scope.listarParams = function() {
      $http.get('https://munif.com.br/encatman-api/api/enquete/'+$routeParams.enqueteId).then(function(response) {
        $scope.desc_enquete = response.data;
      });
    }
    $scope.listarParams();

    $scope.responde = function(resposta){
      console.log(resposta);
      var data = {opcao:resposta};
      $http.post('https://munif.com.br/encatman-api/api/resposta',data)
      .then(function(response) {
        $scope.status="Votou "+resposta.texto;
        $scope.votou=true;
      },
      function(response) {
        $scope.status="Problemas ao votar";
      });
    }
  }]);
  crt.controller('CriarCtrl', ['$scope','$http', function($scope,$http) {
  $scope.titulo="Nova Enquete";
  $scope.texto="Texto";
  $scope.items = [];
  $scope.itemName="";

  $scope.addItem = function (itemName) {
    $scope.items.push({
      texto: itemName
    });
    $scope.itemName="";
  };
  $scope.removeItem = function (index) {
    $scope.items.splice(index, 1);
  };

  $scope.addEnquete = function(){
    console.log("ENVIANDO");
    var enquete={
      urlImagem:'http://www.prefeiturateotonio.com.br/userfiles/conteudos/image/iptu/enquete.jpg',
      titulo: $scope.titulo,
      texto: $scope.texto,
      opcoes: $scope.items
    };
    console.log(enquete);


    $http.post('https://munif.com.br/encatman-api/api/enquete',enquete)
    .then(function(response) {
      console.log("OK");
      console.log(response);
      alert('Cadastrado com Sucesso !');
      $scope.titulo="Nova Enquete";
      $scope.texto="Texto";
      $scope.items = [];
      $scope.itemName="";
    },
    function(response) {
      console.log("ERROR");
      console.log(response);
      alert('Error 404 Not Found API !');
    });




  }
}]);
