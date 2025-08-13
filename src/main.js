import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import {GUI} from 'dat.gui';
import {Cube} from './shapes.js';

const gui = new GUI();
const rayCaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let dragObjectArray = [];
let shapes = {};
let selectedShape = "";

let selectedCube = {
  width: 0,
  height: 0,
  depth: 0,
  color: "",
  edit: () => {
    console.log(selectedShape)
    // selectedShape.cubeMesh.scale.x = selectedCube['x'];
    // selectedShape.cubeMesh.scale.x = selectedCube['y'];
    // selectedShape.cubeMesh.scale.x = selectedCube['z'];
    // selectedShape.cubeMesh.material.color.set(selectedCube['color']);
    // console.log(selectedShape)
  }
}

let createCube = {
  width: 0,
  height: 0,
  depth: 0,
  color: "#787FE8",
  create: () => {
    if( (createCube['width'] != 0  && createCube['height'] != 0) || (createCube['width'] != 0 && createCube['depth'] != 0 ) || (createCube['height'] != 0 && createCube['depth'] != 0))
    {
      let cube = new Cube(scene, createCube['color'], createCube['width'], createCube['height'], createCube['depth']);
      cube.cubeMesh.position.y = 0.50 + (0.485 * (cube.cubeGeometry.parameters.height - 1));
      dragObjectArray.push(cube.cubeMesh);
      shapes[cube.cubeMesh.geometry.uuid] = cube;
    }
  }
}

let create = gui.addFolder("Create Cube");
create.add(createCube, 'width', 0, 4, .1);
create.add(createCube, 'height', 0, 4, .1);
create.add(createCube, 'depth', 0, 4, .1);
create.addColor(createCube, 'color');
create.add(createCube, 'create');

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
    }
    editFolder = null;
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
  }
}

const renderLoop = () => {
  if(selectedShape)
  {
    validateObjectCoordinates(selectedShape);

    if(changeFolder == true && editFolder == null)
    {
      switch(selectedShape.objectType)
    {
      case 'Cube':
        selectedCube['width'] = selectedShape.cubeGeometry.parameters.width;
        selectedCube['height'] = selectedShape.cubeGeometry.parameters.height;
        selectedCube['depth'] = selectedShape.cubeGeometry.parameters.depth;
        selectedCube['color'] = selectedShape.color;
        editFolder = gui.addFolder("Edit Cube");
        editFolder.add(selectedShape, 'width', 0, 4).onChange((value) => {
          selectedShape.cubeMesh.scale.x = (value / selectedShape.widthDivisionNumber);
          selectedShape.cubeGeometry.parameters.width = value;
        })
        editFolder.add(selectedShape, 'height', 0, 4).onChange((value) => {
          selectedShape.cubeMesh.scale.y = (value / selectedShape.heightDivisionNumber);
          selectedShape.cubeGeometry.parameters.height = value
        });
        editFolder.add(selectedCube, 'depth', 0, 4).onChange((value) => {
          selectedShape.cubeMesh.scale.z = (value / selectedShape.depthDivisionNumber);
          selectedShape.cubeGeometry.parameters.depth = value;
        })
        editFolder.addColor(selectedCube, 'color').onChange( (value) => {
          selectedShape.cubeMesh.material.color.set(value);
          selectedShape.color = value;
        });
        editFolder.add(selectedCube, 'edit');
    }
    }
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
}

renderLoop();