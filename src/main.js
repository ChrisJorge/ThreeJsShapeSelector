import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import {GUI} from 'dat.gui';
import {Cube, Sphere} from './shapes.js';

const gui = new GUI();
const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let isOverGui = false;
const guiBox = document.querySelector('.dg.ac');
guiBox.addEventListener('mouseenter', () => isOverGui = true);
guiBox.addEventListener('mouseleave', () => isOverGui = false);

let dragObjectArray = [];
let shapes = {};
let selectedShape = "";

let createCube = {
  width: 0.1,
  height: 0.1,
  depth: 0.1,
  color: "#787FE8",
  create: () => {
      let cube = new Cube(scene, createCube['color'], createCube['width'], createCube['height'], createCube['depth']);
      cube.cubeMesh.position.y = 0.50 + (0.485 * (cube.cubeGeometry.parameters.height - 1));
      dragObjectArray.push(cube.cubeMesh);
      shapes[cube.objectID] = cube;
  }
}

let createSphere = {
  radius: 0.1,
  widthSegments: 3,
  heightSegments: 2,
  color:  "#787FE8",
  create: () => {
    let sphere = new Sphere(scene, createSphere['color'], createSphere['radius'], createSphere['widthSegments'], createSphere['heightSegments']);
    dragObjectArray.push(sphere.sphereMesh);
    shapes[sphere.objectID] = sphere;
  }
}

let cubeFolder = gui.addFolder("Create Cube");
cubeFolder.add(createCube, 'width', 0.1, 4, .1);
cubeFolder.add(createCube, 'height', 0.1, 4, .1);
cubeFolder.add(createCube, 'depth', 0.1, 4, .1);
cubeFolder.addColor(createCube, 'color');
cubeFolder.add(createCube, 'create');

let sphereFolder = gui.addFolder('Create Sphere');
sphereFolder.add(createSphere, "radius", 0.1, 2, 0.1);
sphereFolder.add(createSphere, "widthSegments", 3, 64, 1);
sphereFolder.add(createSphere, "heightSegments", 2, 32, 1);
sphereFolder.addColor(createSphere, 'color');
sphereFolder.add(createSphere, 'create');

let editFolder = null;
let changeFolder = false; // Used to determine if the edit Folder needs new values (Different shape or different square)
let lastSelectedShape = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
scene.add(camera);

const canvas = document.querySelector('.threeJS');
const renderer = new THREE.WebGLRenderer({canvas : canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.y = 2.63;
window.innerWidth > 800 ? camera.position.z = 8.63 : camera.position.z = 11.63; 

const gridHelper = new THREE.GridHelper(10,10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const orbitController = new OrbitControls(camera, renderer.domElement);
orbitController.enableDamping = true;

const dragController = new DragControls(dragObjectArray, camera, renderer.domElement);

dragController.addEventListener('dragstart', (event) => {
  if(selectedShape == shapes[event.object.geometry.uuid])
  {
    changeFolder = false;
  }
  else
  {
    changeFolder = true;
    switch(lastSelectedShape)
    {
      case 'Cube':
        gui.removeFolder(editFolder);
        editFolder = null;
        break;
      case "Sphere":
        gui.removeFolder(editFolder);
        editFolder = null;
        break;
      default:
        break;
    }
    
  }
  orbitController.enabled = false;
  selectedShape = shapes[event.object.geometry.uuid];
  lastSelectedShape = shapes[event.object.geometry.uuid]['objectType']
})

dragController.addEventListener('dragend', () => {
    orbitController.enabled = true;
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; // Gets the aspect ratio of the application
  camera.updateProjectionMatrix(); // Update the projection to maintain the aspect ratio 
  renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the window being rendered
})

window.addEventListener('orientationchange', () => {
  camera.aspect = window.innerWidth / window.innerHeight; // Gets the aspect ratio of the application
  camera.updateProjectionMatrix(); // Update the projection to maintain the aspect ratio 
  renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the window being rendered
})

window.addEventListener('click', (event) => {

  if(isOverGui == false)
  {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    rayCaster.setFromCamera(pointer, camera);
    const intersectedObject = rayCaster.intersectObjects(scene.children);

    if(intersectedObject.length > 0)
    {
        let selected = null;
        for(let index = 0; index < intersectedObject.length; index++)
        {
            if (intersectedObject[index].object.type == 'Mesh')
            {
                selected = intersectedObject[index];
                selectedShape = shapes[selected.object.geometry.uuid];
                break;
            }
        }
    } 
  }
})

const validateObjectCoordinates = (selectedShape) => {

  if(selectedShape.objectType == 'Cube')
  {
    if(selectedShape.cubeMesh.position.y < 3)
    {
      if(selectedShape.cubeMesh.position.y < (0.50 + (0.485 * (selectedShape.cubeGeometry.parameters.height - 1))))
      {
        selectedShape.cubeMesh.position.y = 0.50 + (0.485 * (selectedShape.cubeGeometry.parameters.height - 1));
      }
    }
    else
    {
      if(selectedShape.cubeMesh.position.y > (4.5 - (0.485 * (selectedShape.cubeGeometry.parameters.height - 1))))
      {
        selectedShape.cubeMesh.position.y = (4.5 - (0.485 * (selectedShape.cubeGeometry.parameters.height - 1)));
      }
    }


    if(selectedShape.cubeMesh.position.x > 0)
    {
      if(selectedShape.cubeMesh.position.x > 5.00 - (selectedShape.cubeGeometry.parameters.width / 2))
      {
        selectedShape.cubeMesh.position.x = 5.00 - (selectedShape.cubeGeometry.parameters.width / 2);
      }
    }
    else
    {
      if(selectedShape.cubeMesh.position.x < -5.00 + (selectedShape.cubeGeometry.parameters.width / 2))
      {
        selectedShape.cubeMesh.position.x = -5.00 + (selectedShape.cubeGeometry.parameters.width / 2);
      }
    }

    if(selectedShape.cubeMesh.position.z > 0)
    {
      if(selectedShape.cubeMesh.position.z > 5.00 - (selectedShape.cubeGeometry.parameters.depth / 2))
      {
        selectedShape.cubeMesh.position.z = 5.00 - (selectedShape.cubeGeometry.parameters.depth / 2);
      }
    }
    else
    {
      if(selectedShape.cubeMesh.position.z < -5.00 + (selectedShape.cubeGeometry.parameters.depth / 2))
      {
        selectedShape.cubeMesh.position.z = -5.00 + (selectedShape.cubeGeometry.parameters.depth / 2);
      }
    }
  }else if(selectedShape.objectType == 'Sphere')
  {
    if(selectedShape.sphereMesh.position.y < 3)
    {
      if(selectedShape.sphereMesh.position.y < selectedShape.sphereGeometry.parameters.radius)
      {
        selectedShape.sphereMesh.position.y = selectedShape.sphereGeometry.parameters.radius;
      }
    } else
    {
      if(selectedShape.sphereMesh.position.y > (5 - selectedShape.sphereGeometry.parameters.radius))
      {
        selectedShape.sphereMesh.position.y = (5 - selectedShape.sphereGeometry.parameters.radius);
      }
    }

     if(selectedShape.sphereMesh.position.x > 0)
    {
      if(selectedShape.sphereMesh.position.x > (5.00 - selectedShape.sphereGeometry.parameters.radius))
      {
        selectedShape.sphereMesh.position.x = (5.00 - selectedShape.sphereGeometry.parameters.radius);
      }
    }
    else
    {
      if(selectedShape.sphereMesh.position.x < -5.00 + (selectedShape.sphereGeometry.parameters.radius))
      {
        selectedShape.sphereMesh.position.x = -5.00 + (selectedShape.sphereGeometry.parameters.radius);
      }
    }
     if(selectedShape.sphereMesh.position.z > 0)
    {
      if(selectedShape.sphereMesh.position.z > 5.00 - (selectedShape.sphereGeometry.parameters.radius))
      {
        selectedShape.sphereMesh.position.z = 5.00 - (selectedShape.sphereGeometry.parameters.radius);
      }
    }
    else
    {
      if(selectedShape.sphereMesh.position.z < -5.00 + (selectedShape.sphereGeometry.parameters.radius))
      {
        selectedShape.sphereMesh.position.z = -5.00 + (selectedShape.sphereGeometry.parameters.radius);
      }
    }
  }
}

const removeIndexFromArray = (arr, value) => {
  for(let index = 0; index < arr.length; index ++)
  {
    if(arr[index].geometry.uuid == value)
    {
      arr.splice(index, 1);
      break;
    }
  }
}

const removeChildFromScene = (scene, value) => {
  for(let index = 3; index < scene.children.length; index ++)
  {

    if(scene.children[index].geometry.uuid == value)
    {
      scene.children.splice(index,1);
      break;
    }
  }
}

const disposeObject = (selectedShape) => {
  delete shapes[selectedShape.objectID];
  selectedShape.sphereGeometry.dispose();
  selectedShape.sphereMaterial.dispose();
  selectedShape.sphereMesh.geometry.dispose();
  selectedShape.sphereMesh.material.dispose();
  scene.remove(selectedShape);
}

const replaceSphere = (sphere, newParameterValue, newParameterName) => {

    let xPosition = sphere.sphereMesh.position.x;
    let yPosition = sphere.sphereMesh.position.y;
    let zPosition = sphere.sphereMesh.position.z;
    let widthSegment = sphere.widthSegments;
    let heightSegment = sphere.heightSegments;
    let radius = sphere.radius;
    let color = sphere.sphereMesh.material.color.getHex();
    let newSphere = null;

    switch(newParameterName)
    {
      case 'radius':
        newSphere = new Sphere(scene, color, newParameterValue, widthSegment, heightSegment);
        break;
      case 'widthSegment':
        newSphere = new Sphere(scene, color, radius, newParameterValue, heightSegment);
        break;
      case 'heightSegment':
        newSphere = new Sphere(scene, color, radius, widthSegment, newParameterValue);
        break;
      default:
        break;
    }

    dragObjectArray.push(newSphere.sphereMesh);
    shapes[newSphere.objectID] = newSphere;
    newSphere.sphereMesh.position.set(xPosition, yPosition, zPosition);
    selectedShape = newSphere;
}

const renderLoop = async () => {
  if(selectedShape)
  {
    validateObjectCoordinates(selectedShape);

    if(changeFolder == true && editFolder == null)
    {
      switch(selectedShape.objectType)
    {
      case 'Cube':
        editFolder = gui.addFolder("Edit Cube");
        editFolder.add(selectedShape, 'width', 0.1, 4, 0.1).onChange((value) => {
          selectedShape.cubeMesh.scale.x = (value / selectedShape.widthDivisionNumber);
          selectedShape.cubeGeometry.parameters.width = value;
        });
        editFolder.add(selectedShape, 'height', 0.1, 4, 0.1).onChange((value) => {
          selectedShape.cubeMesh.scale.y = (value / selectedShape.heightDivisionNumber);
          selectedShape.cubeGeometry.parameters.height = value
        });
        editFolder.add(selectedShape, 'depth', 0.1, 4, 0.1).onChange((value) => {
          selectedShape.cubeMesh.scale.z = (value / selectedShape.depthDivisionNumber);
          selectedShape.cubeGeometry.parameters.depth = value;
        });
        editFolder.addColor(selectedShape, 'color').onChange( (value) => {
          selectedShape.cubeMesh.material.color.set(value);
          selectedShape.color = value;
        });
        break;
      case "Sphere":
        editFolder = gui.addFolder("Edit Sphere");
        editFolder.add(selectedShape, "radius", .1, 2, 0.1).onChange((value) => {
          removeIndexFromArray(dragObjectArray, selectedShape.objectID);
          removeChildFromScene(scene, selectedShape.objectID);
          disposeObject(selectedShape);
          replaceSphere(selectedShape, value, 'radius');
        });
        editFolder.add(selectedShape, "widthSegments", 3, 64, 1).onChange((value) => {
          removeIndexFromArray(dragObjectArray, selectedShape.objectID);
          disposeObject(selectedShape);
          removeChildFromScene(scene, selectedShape.objectID);
          replaceSphere(selectedShape, value, 'widthSegment');
        });
        editFolder.add(selectedShape, "heightSegments", 3, 32, 1).onChange((value) => {
          removeIndexFromArray(dragObjectArray, selectedShape.objectID);
          disposeObject(selectedShape);
          removeChildFromScene(scene, selectedShape.objectID);
          replaceSphere(selectedShape, value, 'heightSegment');
        });
        editFolder.addColor(selectedShape, 'color').onChange((value) => {
          selectedShape.sphereMesh.material.color.set(value);
          selectedShape.color = value;
        });

    }
    }
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
}

renderLoop();