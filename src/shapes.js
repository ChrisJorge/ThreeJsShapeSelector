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
        this.objectType = 'Cube';
    }
}

export class Sphere{
    constructor(scene, color, radius, widthSegments, heightSegments)
    {
        this.scene = scene;
        this.color = color;
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments, 0, this.phiLength, 0, this.thetaLength);
        this.sphereColor = new THREE.Color(this.color);
        this.sphereMaterial = new THREE.MeshBasicMaterial({color: this.sphereColor});
        this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.scene.add(this.sphereMesh);
        this.sphereMesh.position.set(0,this.radius,0);
        this.objectID = this.sphereMesh.geometry.uuid;
        this.objectType = 'Sphere';
    }
}