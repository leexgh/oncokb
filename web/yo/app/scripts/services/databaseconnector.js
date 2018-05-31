'use strict';

angular.module('oncokbApp')
    .factory('DatabaseConnector', [
        '$timeout',
        '$q',
        '$rootScope',
        'config',
        'Gene',
        'Alteration',
        'TumorType',
        'Evidence',
        'SearchVariant',
        'GenerateDoc',
        'DriveOncokbInfo',
        'DriveAnnotation',
        'SendEmail',
        'DataSummary',
        'Cache',
        'OncoTree',
        'InternalAccess',
        'ApiUtils',
        'PrivateApiUtils',
        function($timeout,
                 $q,
                 $rootScope,
                 config,
                 Gene,
                 Alteration,
                 TumorType,
                 Evidence,
                 SearchVariant,
                 GenerateDoc,
                 DriveOncokbInfo,
                 DriveAnnotation,
                 SendEmail,
                 DataSummary,
                 Cache,
                 OncoTree,
                 InternalAccess,
                 ApiUtils,
                 PrivateApiUtils) {
            var numOfLocks = {};
            var data = {};
            var testing = config.testing || false;
            function getReviewedData(evidenceType) {
                var deferred = $q.defer();
                if (evidenceType === 'geneType') {
                    DataSummary.getGeneType()
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(result) {
                            deferred.reject(result);
                        });
                } else {
                    DataSummary.getEvidenceByType(evidenceType)
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(result) {
                            deferred.reject(result);
                        });
                }
                return deferred.promise;
            }

            function searchVariant(params, success, fail) {
                if (testing) {
                    SearchVariant.annotationFromFile(params)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                } else {
                    SearchVariant
                        .getAnnotation(params)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function updateGene(data, success, fail) {
                if (testing) {
                    success('');
                } else {
                    DriveAnnotation
                        .updateGene(data)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function updateGeneType(hugoSymbol, data, historyData, success, fail) {
                if (testing) {
                    success('');
                    updateHistory(historyData);
                } else {
                    DriveAnnotation
                        .updateGeneType(hugoSymbol, data)
                        .success(function(data) {
                            success(data);
                            updateHistory(historyData);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function updateEvidence(uuid, data, success, fail) {
                DriveAnnotation
                    .updateEvidence(uuid, data)
                    .success(function(data) {
                        success(data);
                    })
                    .error(function() {
                        fail();
                    });
            }

            function getEvidencesByUUID(uuid, success, fail) {
                if (testing) {
                    success('');
                } else {
                    DriveAnnotation
                        .getEvidencesByUUID(uuid)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function getEvidencesByUUIDs(uuids, success, fail) {
                if (testing) {
                    success('');
                } else {
                    DriveAnnotation
                        .getEvidencesByUUIDs(uuids)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }
            function getPubMedArticle(pubMedIDs, success, fail) {
                DriveAnnotation
                    .getPubMedArticle(pubMedIDs)
                    .then(function(data) {
                        success(data);
                    }, function() {
                        fail();
                    });
            }
            function getClinicalTrial(nctId, success, fail) {
                DriveAnnotation
                    .getClinicalTrial(nctId)
                    .success(function(data) {
                        success(data);
                    })
                    .error(function() {
                        fail();
                    });
            }

            function deleteEvidences(data, historyData, success, fail) {
                if (testing) {
                    success('');
                    updateHistory(historyData);
                } else {
                    DriveAnnotation
                        .deleteEvidences(data)
                        .success(function(data) {
                            success(data);
                            updateHistory(historyData);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function updateVUS(hugoSymbol, data, success, fail) {
                if ($rootScope.internal) {
                    if (testing) {
                        success('');
                    } else {
                        DriveAnnotation
                            .updateVUS(hugoSymbol, data)
                            .success(function(data) {
                                success(data);
                            })
                            .error(function(error) {
                                var subject = 'VUS update Error for ' + hugoSymbol;
                                var content = 'The system error returned is ' + JSON.stringify(error);
                                sendEmail({sendTo: 'dev.oncokb@gmail.com', subject: subject, content: content},
                                    function(result) {
                                        console.log('sent old history to oncokb dev account');
                                    },
                                    function(error) {
                                        console.log('fail to send old history to oncokb dev account', error);
                                    }
                                );
                                fail(error);
                                setAPIData('vus', hugoSymbol, data);
                            });
                    }
                } else {
                    setAPIData('vus', hugoSymbol, data);
                }
            }
            function setAPIData(type, hugoSymbol, data) {
                if (!$rootScope.apiData.has(hugoSymbol)) {
                    $rootScope.apiData.set(hugoSymbol, $rootScope.metaModel.createMap());
                }
                if (type === 'vus') {
                    $rootScope.apiData.get(hugoSymbol).set('vus', $rootScope.metaModel.createMap({data: data}));
                } else if (type === 'priority' || type === 'drug') {
                    // TODO
                    // $rootScope.apiData.get(hugoSymbol).set(type, $rootScope.metaModel.createList(''));
                }
            }
            function updateEvidenceBatch(data, historyData, success, fail) {
                if (testing) {
                    success('');
                    updateHistory(historyData);
                } else {
                    DriveAnnotation
                        .updateEvidenceBatch(data)
                        .then(function(data) {
                            success(data);
                            updateHistory(historyData);
                        }, function() {
                            fail();
                        });
                }
            }

            function updateEvidenceTreatmentPriorityBatch(data, success, fail) {
                if (testing) {
                    success('');
                } else {
                    DriveAnnotation
                        .updateEvidenceTreatmentPriorityBatch(data)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function createGoogleFolder(params) {
                var deferred = $q.defer();

                if (testing) {
                    deferred.resolve('test name');
                } else {
                    GenerateDoc
                        .createFolder(params)
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function() {
                            deferred.reject();
                        });
                }
                return deferred.promise;
            }

            function sendEmail(params, success, fail) {
                if (testing) {
                    success(true);
                } else {
                    SendEmail
                        .init(params)
                        .success(function(data) {
                            success(data);
                        })
                        .error(function() {
                            fail();
                        });
                }
            }

            function timeout(callback, timestamp) {
                $timeout(function() {
                    if (numOfLocks[timestamp] === 0) {
                        callback(data[timestamp]);
                    } else {
                        timeout(callback, timestamp);
                    }
                }, 100);
            }

            function testAccess(successCallback, failCallback) {
                if (testing) {
                    if (angular.isFunction(successCallback)) {
                        successCallback();
                    }
                } else {
                    InternalAccess
                        .hasAccess()
                        .success(function(data, status, headers, config) {
                            if (angular.isFunction(successCallback)) {
                                successCallback(data, status, headers, config);
                            }
                        })
                        .error(function(data, status, headers, config) {
                            if (angular.isFunction(failCallback)) {
                                failCallback(data, status, headers, config);
                            }
                        });
                }
            }

            function getCacheStatus() {
                var deferred = $q.defer();
                if (testing) {
                    deferred.resolve('enabled');
                } else {
                    Cache.getStatus()
                        .then(function(data) {
                            deferred.resolve(data);
                        }, function(result) {
                            deferred.reject(result);
                        });
                }
                return deferred.promise;
            }

            function setCache(operation) {
                var deferred = $q.defer();
                if (testing) {
                    if (operation === 'enable') {
                        deferred.resolve('enabled');
                    }
                    if (operation === 'disable') {
                        deferred.resolve('disabled');
                    }
                } else {
                    switch (operation) {
                    case 'disable':
                        Cache.disable()
                            .success(function(data) {
                                deferred.resolve(data);
                            })
                            .error(function(result) {
                                deferred.reject(result);
                            });
                        break;
                    case 'enable':
                        Cache.enable()
                            .success(function(data) {
                                deferred.resolve(data);
                            })
                            .error(function(result) {
                                deferred.reject(result);
                            });
                        break;
                    case 'reset':
                        Cache.reset()
                            .success(function(data) {
                                deferred.resolve(data);
                            })
                            .error(function(result) {
                                deferred.reject(result);
                            });
                        break;
                    default:
                        break;
                    }
                }
                return deferred.promise;
            }

            function updateGeneCache(hugoSymbol) {
                var deferred = $q.defer();
                if (testing) {
                    deferred.resolve();
                } else if (hugoSymbol) {
                    Cache.updateGene(hugoSymbol)
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(result) {
                            deferred.reject(result);
                        });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
            }

            function getOncoTreeMainTypes() {
                var deferred = $q.defer();
                OncoTree.getMainType()
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            function getOncoTreeTumorTypesByMainType(mainType) {
                var deferred = $q.defer();
                OncoTree.getTumorTypeByMainType(mainType)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            function getOncoTreeTumorTypesByMainTypes(mainTypes) {
                var deferred = $q.defer();
                OncoTree.getTumorTypesByMainTypes(mainTypes)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            function getOncoTreeTumorTypeByName(name, exactMatch) {
                var deferred = $q.defer();
                OncoTree.getTumorType('name', name, exactMatch)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }
            function getTumorSubtypes() {
                var deferred = $q.defer();
                OncoTree.getTumorSubtypes().then(function(data) {
                    data.data.push({
                        name: 'All Liquid Tumors'
                    });
                    data.data.push({
                        name: 'All Solid Tumors'
                    });
                    data.data.push({
                        name: 'All Tumors'
                    });
                    data.data.push({
                        name: 'Germline Disposition'
                    });
                    data.data.push({
                        name: 'All Pediatric Tumors'
                    });
                    data.data.push({
                        name: 'Other Tumor Types'
                    });
                    deferred.resolve(data.data);
                }, function(result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }

            function getIsoforms(type) {
                var deferred = $q.defer();
                ApiUtils.getIsoforms(type)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            function getOncogeneTSG() {
                var deferred = $q.defer();
                ApiUtils.getOncogeneTSG()
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            function getSuggestedVariants() {
                var deferred = $q.defer();
                if (testing) {
                    deferred.resolve({
                        meta: '',
                        data: ['Fusion']
                    });
                } else {
                    PrivateApiUtils.getSuggestedVariants()
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(result) {
                            deferred.reject(result);
                        });
                }
                return deferred.promise;
            }

            function isHotspot(hugoSymbol, variant) {
                var deferred = $q.defer();
                if (testing) {
                    deferred.resolve({
                        meta: '',
                        data: false
                    });
                } else {
                    PrivateApiUtils.isHotspot(hugoSymbol, variant)
                        .success(function(data) {
                            deferred.resolve(data);
                        })
                        .error(function(result) {
                            deferred.reject(result);
                        });
                }
                return deferred.promise;
            }

            function updateHistory(historyData) {
                if (!$rootScope.historyRef.api) {
                    $rootScope.historyRef.api = [];
                }
                $rootScope.historyRef.api.push({
                    admin: $rootScope.me.name,
                    timeStamp: new Date().getTime(),
                    records: historyData
                });
            }

            function lookupVariants(body) {
                var deferred = $q.defer();
                SearchVariant.lookupVariants(body)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
                return deferred.promise;
            }

            // Public API here
            return {
                getGeneTumorType: function(callback) {
                    var timestamp = new Date().getTime().toString();

                    numOfLocks[timestamp] = 2;
                    data[timestamp] = {};

                    getAllGene(function(d) {
                        data[timestamp].genes = d;
                    }, timestamp);
                    getAllTumorType(function(d) {
                        data[timestamp].tumorTypes = d;
                    }, timestamp);

                    timeout(callback, timestamp);
                },
                searchAnnotation: searchVariant,
                updateGene: updateGene,
                updateGeneType: updateGeneType,
                updateEvidence: updateEvidence,
                deleteEvidences: deleteEvidences,
                updateVUS: updateVUS,
                updateEvidenceBatch: updateEvidenceBatch,
                updateEvidenceTreatmentPriorityBatch: updateEvidenceTreatmentPriorityBatch,
                sendEmail: sendEmail,
                getCacheStatus: getCacheStatus,
                disableCache: function() {
                    return setCache('disable');
                },
                enableCache: function() {
                    return setCache('enable');
                },
                resetCache: function() {
                    return setCache('reset');
                },
                updateGeneCache: function(hugoSymbol) {
                    return updateGeneCache(hugoSymbol);
                },
                getOncoTreeMainTypes: getOncoTreeMainTypes,
                getOncoTreeTumorTypesByMainType: getOncoTreeTumorTypesByMainType,
                getOncoTreeTumorTypesByMainTypes: getOncoTreeTumorTypesByMainTypes,
                getOncoTreeTumorTypeByName: getOncoTreeTumorTypeByName,
                testAccess: testAccess,
                getIsoforms: getIsoforms,
                getOncogeneTSG: getOncogeneTSG,
                getSuggestedVariants: getSuggestedVariants,
                isHotspot: isHotspot,
                getEvidencesByUUID: getEvidencesByUUID,
                getEvidencesByUUIDs: getEvidencesByUUIDs,
                getPubMedArticle: getPubMedArticle,
                getClinicalTrial: getClinicalTrial,
                getReviewedData: getReviewedData,
                lookupVariants: lookupVariants,
                getTumorSubtypes: getTumorSubtypes
            };
        }]);
