import * as THREE from 'three';

export class Cube{
    constructor(scene, color, width, height, depth)
    {
        this.scene = scene;
        this.color = color;
        this.width = width;
        this.widthDivisionNumber = width;
        this.height = height;
        this.heightDivisionNumber = height;
        this.depth = depth;
        this.depthDivisionNumber = depth;
        this.cubeGeometry = new THREE.BoxGeometry(width, height, depth);
        this.cubeColor = new THREE.Color(this.color);
        this.cubeMaterial = new THREE.MeshBasicMaterial({color: this.cubeColor});
        this.cubeMesh = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.scene.add(this.cubeMesh);
        this.cubeMesh.position.set(0,0,0);
        this.objectID = this.cubeMesh.geometry.uuid;
        this.objectType = 'Cube'
    }
}