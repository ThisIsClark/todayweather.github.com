window.addEventListener('load', function() {
  var menu_open = false;

  window.awe.init({
    device_type: awe.AUTO_DETECT_DEVICE_TYPE,
    settings: {
      container_id: 'container',
      fps: 30,
      default_camera_position: { x:0, y:0, z:0 },
      default_lights: [{
        id: 'point_light',
        type: 'point',
        color: 0xFFFFFF
      }]
    },
    ready: function() {
      awe.util.require([
        {
          capabilities: ['gum','webgl'],
          files: [ 
            ['lib/awe-standard-dependencies.js', 'lib/awe-standard.js'],
            'lib/awe-standard-window_resized.js',
            'lib/awe-standard-object_clicked.js',
            'lib/awe-jsartoolkit-dependencies.js',
            'lib/awe.marker_ar.js',
            'lib/awe.geo_ar.js'
          ],
          success: function() {
			var device_type = awe.device_type();
			var browser_unsupported = false;
			var already_showed = false;
			if (device_type != 'android') {
				browser_unsupported = true;
			} else if (!navigator.userAgent.match(/chrome|firefox/i)) {
				browser_unsupported = true;
			}
			if (browser_unsupported) {
				document.body.innerHTML = '<p>This demo currently requires a standards compliant Android browser (e.g. Chrome M33).</p>';
				return;
			}

			// setup and paint the scene
			window.awe.setup_scene();

			// add some points of interest (poi) for each of the compass points
			awe.pois.add({ id:'north', position: { x:0, y:0, z:200 } });
			awe.pois.add({ id:'north_east', position: { x:200, y:0, z:200 } });
			awe.pois.add({ id:'east', position: { x:200, y:0, z:0 } });
			awe.pois.add({ id:'south_east', position: { x:200, y:0, z:-200 } });
			awe.pois.add({ id:'south', position: { x:0, y:0, z:-200 } });
			awe.pois.add({ id:'south_west', position: { x:-200, y:0, z:-200 } });
			awe.pois.add({ id:'west', position: { x:-200, y:0, z:0 } });
			awe.pois.add({ id:'north_west', position: { x:-200, y:0, z:200 } });

            // Points of Interest
            awe.events.add([{
              id: 'ar_tracking_marker',
              device_types: {
                pc: 1,
                android: 1
              },
              register: function(handler) {
                window.addEventListener('ar_tracking_marker', handler, false);
              },
              unregister: function(handler) {
                window.removeEventListener('ar_tracking_marker', handler, false);
              },
              handler: function(event) {
                if (event.detail) {
                  if (event.detail['64']) {
					  alert("64");
                  } else if (event.detail['18'] && !already_showed) {
					already_showed = true;
			        // add projections to each of the pois
			        awe.projections.add({ 
			          id:'n', 
			          geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                rotation:{ x:30, y:30, z:0 },
			          material:{ 
			            type: 'phong',
			            color:0xFF0000, 
			          },
			        }, { poi_id: 'north' });

			        awe.projections.add({ 
			          id:'ne', 
			          geometry:{ shape:'sphere', radius:10 }, 
			          material:{ 
			            type: 'phong',
			            color:0xCCCCCC, 
			          },
			        }, { poi_id: 'north_east' });

			        awe.projections.add({ 
			          id:'e', 
			          geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                rotation:{ x:30, y:30, z:0 },
			          material:{ 
			            type: 'phong',
			            color:0x00FF00, 
			          },
			        }, { poi_id: 'east' });

			        awe.projections.add({ 
			          id:'se', 
			          geometry:{ shape:'sphere', radius:10 }, 
			          material:{ 
			            type: 'phong',
			            color:0xCCCCCC, 
			          },
			        }, { poi_id: 'south_east' });

			        awe.projections.add({ 
			          id:'s', 
			          geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                rotation:{ x:30, y:30, z:0 },
			          material:{ 
			            type: 'phong',
			            color:0xFFFFFF, 
			          },
			        }, { poi_id: 'south' });

			        awe.projections.add({ 
			          id:'sw', 
			          geometry:{ shape:'sphere', radius:10 }, 
			          material:{ 
			            type: 'phong',
			            color:0xCCCCCC, 
			          },
			        }, { poi_id: 'south_west' });

			        awe.projections.add({ 
			          id:'w', 
			          geometry:{ shape:'cube', x:50, y:50, z:50 }, 
                rotation:{ x:30, y:30, z:0 },
			          material:{ 
			            type: 'phong',
			            color:0x0000FF, 
			          },
			        }, { poi_id: 'west' });

			        awe.projections.add({ 
			          id:'nw', 
			          geometry:{ shape:'sphere', radius:10 }, 
			          material:{ 
			            type: 'phong',
			            color:0xCCCCCC, 
			          },
			        }, { poi_id: 'north_west' });

                  } else if (menu_open) {
                    awe.projections.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'wormhole'
                      }
                    });
                  }
                  else {
                    awe.pois.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                  }
                  awe.scene_needs_rendering = 1;
                }
              }
            }]);

/*
            window.addEventListener('object_clicked', function(e) {
              switch (e.detail.projection_id) {
                case 'wormhole':
                  if (!menu_open) {
                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 35}
                      },
                      where: {id: 'ar_button_one'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 70}
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 105}
                      },
                      where: {id: 'ar_button_three'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 140}
                      },
                      where: {id: 'ar_button_four'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 175}
                      },
                      where: {id: 'ar_button_five'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 210}
                      },
                      where: {id: 'ar_button_six'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 245}
                      },
                      where: {id: 'ar_button_seven'}
                    });
                  } else {
                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_one'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_three'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_four'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_five'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_six'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_seven'}
                    });
                  }

                  menu_open = !menu_open;
                break;
                case 'ar_button_one':
                case 'ar_button_two':
                case 'ar_button_three':
                case 'ar_button_four':
                case 'ar_button_five':
                case 'ar_button_six':
                case 'ar_button_seven':
                  var request = new XMLHttpRequest();
                  request.open('GET', 'http://maker.ifttt.com/trigger/'+e.detail.projection_id+'/with/key/yourkeyhere', true);

                  request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                      var data = JSON.parse(request.responseText);
                      console.log(data);
                    }
                  };

                  request.send();
                break;
              }
            }, false);
*/
          } // success()
        },
        {
          capabilities: [],
          success: function() { 
            document.body.innerHTML = '<p>Try this demo in the latest version of Chrome or Firefox on a PC or Android device</p>';
          }
        }
      ]); // awe.util.require()
    } // ready()
  }); // window.awe.init()
}); // load