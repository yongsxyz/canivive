import * as THREE from 'three'
import { Camera } from './Camera'

import { PositionComponent } from '@shared/component/PositionComponent'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/inputMessage'
import { EntityManager } from '@shared/system/EntityManager'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import { CameraFollowComponent } from './ecs/component/CameraFollowComponent'
import { MutableRefObject } from 'react'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

type PerformancePreset = 'very-low' | 'low' | 'medium' | 'high'

export class Renderer extends THREE.WebGLRenderer {
  camera: Camera
  scene: THREE.Scene
  css2DRenderer: CSS2DRenderer
  composer?: EffectComposer
  performancePreset: PerformancePreset = 'medium'


  private directionalLight: THREE.DirectionalLight | undefined
  constructor(public gameContainerRef: MutableRefObject<any>, performancePreset?: PerformancePreset) {
    super({
      antialias: performancePreset === 'high' || performancePreset === 'medium',
      stencil: false,
      powerPreference: performancePreset === 'very-low' ? 'low-power' : 'high-performance'
    })

    if (performancePreset) {
      this.performancePreset = performancePreset
    }

    this.camera = new Camera(this)

    this.scene = new THREE.Scene()
    this.shadowMap.enabled = performancePreset !== 'very-low'
    this.shadowMap.type = this.getShadowMapTypeForPreset()

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(this.getDevicePixelRatio())

    this.css2DRenderer = new CSS2DRenderer()
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = '0'
    this.css2DRenderer.domElement.style.pointerEvents = 'none'

    this.domElement.addEventListener('contextmenu', (event) => event.preventDefault())
    this.addDirectionnalLight()

    const legacySky = false
    if (legacySky) {
      this.addStaticLight()
      this.addSky()
    } else {
      if (this.performancePreset !== 'very-low') {
        this.addHDRSky()
      } else {
        this.scene.background = new THREE.Color(0x87CEEB) // Simple sky color for very low
      }
    }

    if (this.performancePreset === 'high') {
      this.setupPostProcessing()
    }

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  private getShadowMapTypeForPreset(): THREE.ShadowMapType {
    switch (this.performancePreset) {
      case 'very-low': return THREE.BasicShadowMap
      case 'low': return THREE.PCFShadowMap
      case 'medium': return THREE.PCFSoftShadowMap
      case 'high': return THREE.PCFSoftShadowMap
      default: return THREE.PCFSoftShadowMap
    }
  }

  private getDevicePixelRatio(): number {
    const isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
      window.navigator.userAgent.toLowerCase()
    );

    const maxPixelRatio = Math.min(window.devicePixelRatio || 1, 2); // hemat batry di mobile ini fix
    if (this.performancePreset === 'very-low') return 0.5;
    if (this.performancePreset === 'low') return isMobile ? 0.65 : 0.85;
    if (this.performancePreset === 'medium') return isMobile ? 0.85 : 1.2;
    return maxPixelRatio;
  }


  private setupPostProcessing() {
    this.toneMapping = THREE.ACESFilmicToneMapping
    this.toneMappingExposure = 0.4

    this.composer = new EffectComposer(this)
    this.composer.setSize(window.innerWidth, window.innerHeight)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.performancePreset === 'high' ? 0.5 : 0.3,
      this.performancePreset === 'high' ? 0.1 : 0.05,
      this.performancePreset === 'high' ? 0.9 : 0.5
    )
    this.composer.addPass(bloomPass)

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    this.composer.addPass(gammaCorrectionPass)
  }

  appendChild() {
    console.log(this.gameContainerRef)
    this.gameContainerRef.current.appendChild(this.domElement)
    if (this.css2DRenderer) document.body.appendChild(this.css2DRenderer.domElement)
    else console.error("Can't append child CSS3DRenderer")
  }

  private addSky() {
    const sun = new THREE.Vector3()
    const sky = new Sky()

    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = 12
    uniforms['rayleigh'].value = 0
    uniforms['mieCoefficient'].value = 0.045
    uniforms['mieDirectionalG'].value = 0.0263

    const elevation = 2
    const azimuth = 360

    const phi = THREE.MathUtils.degToRad(90 - elevation)
    const theta = THREE.MathUtils.degToRad(azimuth)

    sun.setFromSphericalCoords(1, phi, theta)
    uniforms['sunPosition'].value.copy(sun)

    sky.scale.setScalar(450000)
    this.scene.add(sky)
  }

  private addHDRSky() {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/sky/rustig_koppie_puresky.webp')
    texture.mapping = THREE.EquirectangularReflectionMapping

    this.scene.background = texture
    if (this.performancePreset !== 'low') {
      this.scene.environment = texture
    }
  }

  private addDirectionnalLight() {
    const lightColor = (this.performancePreset === 'very-low' || this.performancePreset === 'low')
      ? 0xffffff
      : 0xff8a0d;

    this.directionalLight = new THREE.DirectionalLight(
      lightColor,
      this.performancePreset === 'very-low' ? 0.8 : 2
    );
    this.directionalLight.position.set(100, 100, -250)

    // Hanya konfigurasi shadow untuk medium dan high
    if (this.performancePreset === 'medium' || this.performancePreset === 'high') {
      let shadowMapSize = 1024
      let shadowSideLength = 150
      let shadowBias = -0.0001
      let shadowNormalBias = 0.02
      let shadowRadius = 1.5

      if (this.performancePreset === 'high') {
        shadowMapSize = 2048
        shadowSideLength = 200
      } else { // medium
        shadowMapSize = 1536
        shadowSideLength = 150
      }

      this.directionalLight.castShadow = true
      this.directionalLight.shadow.mapSize.height = shadowMapSize
      this.directionalLight.shadow.mapSize.width = shadowMapSize
      this.directionalLight.shadow.camera.top = shadowSideLength
      this.directionalLight.shadow.camera.bottom = -shadowSideLength
      this.directionalLight.shadow.camera.left = -shadowSideLength
      this.directionalLight.shadow.camera.right = shadowSideLength
      this.directionalLight.shadow.camera.near = 0.01
      this.directionalLight.shadow.camera.far = 500
      this.directionalLight.shadow.bias = shadowBias
      this.directionalLight.shadow.normalBias = shadowNormalBias
      this.directionalLight.shadow.radius = shadowRadius
    } else {
      // Nonaktifkan shadow untuk very-low dan low
      this.directionalLight.castShadow = false
    }

    const lightTarget = new THREE.Object3D()
    this.directionalLight.target = lightTarget
    this.scene.add(this.directionalLight, lightTarget)
  }

  private addStaticLight() {
    const groundColor = (this.performancePreset === 'very-low' || this.performancePreset === 'low')
      ? 0x333333
      : 0xff8a05;

    const hemiLight = new THREE.HemisphereLight(
      0xffffff,
      groundColor,
      this.performancePreset === 'very-low' ? 0.5 : 1
    );
    hemiLight.position.set(0, 50, 0)
    this.scene.add(hemiLight)
  }


  update(deltaTime: number, entities: Entity[], inputMessage: InputMessage) {
    const followedEntity = EntityManager.getFirstEntityWithComponent(
      entities,
      CameraFollowComponent
    )
    if (followedEntity && this.directionalLight) {
      const position = followedEntity.getComponent(PositionComponent)
      if (position) {
        this.directionalLight.position.lerp(
          new THREE.Vector3(position.x, position.y + 150, position.z + 150),
          0.1
        )
        this.directionalLight.target.position.lerp(
          new THREE.Vector3(position.x, position.y, position.z),
          0.1
        )
      }
    }

    this.camera.update(deltaTime, entities, inputMessage)
    this.css2DRenderer.render(this.scene, this.camera)

    if (this.composer && this.performancePreset === 'high') {
      this.composer.render(deltaTime)
    } else {
      this.render(this.scene, this.camera)
    }
  }

  private onWindowResize() {
    if (!this.camera) return
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.setSize(window.innerWidth, window.innerHeight)
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight)
    }
  }


  setPerformancePreset(preset: PerformancePreset) {

    this.performancePreset = preset
    this.shadowMap.enabled = preset !== 'very-low'
    this.shadowMap.type = this.getShadowMapTypeForPreset()
    this.setPixelRatio(this.getDevicePixelRatio())

    // Update lighting
    if (this.directionalLight) {
      this.directionalLight.intensity = preset === 'very-low' ? 1 : 2
      this.directionalLight.castShadow = preset !== 'very-low'

      // Update shadow quality
      let shadowMapSize = 1024
      let shadowSideLength = 150
      let shadowBias = -0.0001
      let shadowNormalBias = 0.02
      let shadowRadius = 1.5

      switch (preset) {
        case 'very-low':
          shadowMapSize = 512
          shadowSideLength = 100
          shadowBias = -0.001
          shadowNormalBias = 0.05
          shadowRadius = 0
          break
        case 'low':
          shadowMapSize = 1024
          shadowSideLength = 120
          shadowBias = -0.0005
          shadowNormalBias = 0.03
          shadowRadius = 0.5
          break
        case 'medium':
          shadowMapSize = 1536
          shadowSideLength = 150
          break
        case 'high':
          shadowMapSize = 2048
          shadowSideLength = 200
          break
      }

      this.directionalLight.shadow.mapSize.height = shadowMapSize
      this.directionalLight.shadow.mapSize.width = shadowMapSize
      this.directionalLight.shadow.camera.top = shadowSideLength
      this.directionalLight.shadow.camera.bottom = -shadowSideLength
      this.directionalLight.shadow.camera.left = -shadowSideLength
      this.directionalLight.shadow.camera.right = shadowSideLength
      this.directionalLight.shadow.bias = shadowBias
      this.directionalLight.shadow.normalBias = shadowNormalBias
      this.directionalLight.shadow.radius = shadowRadius
    }

    // Update post-processing
    if (preset === 'high') {
      if (!this.composer) {
        this.setupPostProcessing()
      }
    } else {
      if (this.composer) {
        this.composer.dispose()
        this.composer = undefined
      }
    }

    // Update environment
    if (preset === 'very-low') {
      this.scene.background = new THREE.Color(0x87CEEB)
      this.scene.environment = null
    } else {
      this.addHDRSky()
    }
  }
}