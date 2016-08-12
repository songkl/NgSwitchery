'use strict';

/**
 * Module to use Switchery as a directive for angular.
 * @TODO implement Switchery as a service, https://github.com/abpetkov/switchery/pull/11
 */
angular.module('NgSwitchery', [])
    .directive('uiSwitch', ['NgSwitchery','$window', '$timeout','$log', '$parse', function(NgSwitchery, $window, $timeout, $log, $parse) {

        /**
         * Initializes the HTML element as a Switchery switch.
         *
         * $timeout is in place as a workaround to work within angular-ui tabs.
         *
         * @param scope
         * @param elem
         * @param attrs
         * @param ngModel
         */
        function linkSwitchery(scope, elem, attrs, ngModel) {
            if(!ngModel) return false;
            var switcher;

            attrs.$observe('disabled', function(value) {
              if (!switcher) {
                return;
              }

              if (value) {
                switcher.disable();
              }
              else {
                switcher.enable();
              }
            });

            // Watch changes
            scope.$watch('initValue', function () {
               initializeSwitch()
            });
            
            function initializeSwitch() {
              $timeout(function() {
                var apply_opt = NgSwitchery.config,
                    attr_opt;
                // Remove any old switcher
                if (switcher) {
                  angular.element(switcher.switcher).remove();
                }
                try {
                    attr_opt = $parse(attrs.uiSwitch)(scope)
                    if (attr_opt) {
                        apply_opt = angular.extend(NgSwitchery.config, attr_opt);
                    }
                }  catch (e){}
                // (re)create switcher to reflect latest state of the checkbox element
                switcher = new $window.Switchery(elem[0], apply_opt);
                var element = switcher.element;
                element.checked = scope.initValue;
                if (attrs.disabled) {
                  switcher.disable();
                }

                switcher.setPosition(false);
                element.addEventListener('change',function(evt) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element.checked);
                    })
                });
                scope.$watch('initValue', function(newValue, oldValue) {
                    switcher.setPosition(false);
                });
              }, 0);
            }
          }

        return {
            require: 'ngModel',
            restrict: 'AE',
            scope : {
              initValue : '=ngModel'
            },
            link: linkSwitchery
        }
    }])
    .provider('NgSwitchery',function NgSwitcheryProvider() {

        var config = {
            color             : '#64bd63'
            , secondaryColor    : '#dfdfdf'
            , jackColor         : '#fff'
            , jackSecondaryColor: null
            , className         : 'switchery'
            , disabled          : false
            , disabledOpacity   : 0.5
            , speed             : '0.4s'
            , size              : 'default'
        };


        return {

            extendConfig : function (newConfig) {
                config = angular.extend(config, newConfig);
            },

            $get : function () {
              return {
                  config : config
              }
            }

        };

    });
