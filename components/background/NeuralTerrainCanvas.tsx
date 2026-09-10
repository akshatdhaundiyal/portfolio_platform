"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";

export default function NeuralTerrainCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 500);
    camera.position.set(0, 9, 44);
    camera.lookAt(0, -3, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color definitions for light vs dark theme
    const getThemeColors = (currentTheme: string) => {
      const isDark = currentTheme === "dark";
      return {
        terrain: isDark ? new THREE.Color("#e2d9cc") : new THREE.Color("#292524"),
        terrainOpacity: isDark ? 0.08 : 0.045, // Soft, non-intrusive wireframe
        edges: isDark ? new THREE.Color("#f3ede2") : new THREE.Color("#44403c"),
        edgeOpacity: isDark ? 0.09 : 0.05,
        dust: isDark ? new THREE.Color("#fef3c7") : new THREE.Color("#78716c"),
        dustOpacity: isDark ? 0.35 : 0.2,
        nodeA: isDark ? new THREE.Color("#f59e0b") : new THREE.Color("#c2410c"), // Amber / Terracotta
        nodeB: isDark ? new THREE.Color("#38bdf8") : new THREE.Color("#0284c7"), // Cyan / Blue
        nodeC: isDark ? new THREE.Color("#d94e34") : new THREE.Color("#991b1b"), // Red
        pulseColor: isDark ? new THREE.Color("#fbbf24") : new THREE.Color("#ea580c"),
      };
    };

    let colors = getThemeColors(themeRef.current);

    // Helper: Soft round chalk texture for particles
    const createChalkCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const chalkTexture = createChalkCircleTexture();

    // ==========================================
    // 1. MATHEMATICAL LOSS SURFACE (ACTUARIAL GLM)
    // ==========================================
    const terrainWidth = 90;
    const terrainHeight = 70;
    const terrainSegX = 48;
    const terrainSegY = 36;
    const terrainGeo = new THREE.PlaneGeometry(
      terrainWidth,
      terrainHeight,
      terrainSegX,
      terrainSegY
    );
    terrainGeo.rotateX(-Math.PI / 2.65);
    terrainGeo.translate(0, -18, -10);

    const terrainMat = new THREE.MeshBasicMaterial({
      color: colors.terrain,
      wireframe: true,
      transparent: true,
      opacity: colors.terrainOpacity,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // Save initial vertex positions for wave equation
    const posAttr = terrainGeo.attributes.position as THREE.BufferAttribute;
    const initialPositions = posAttr.array.slice() as Float32Array;

    // ==========================================
    // 2. NEURAL NETWORK CONSTELLATION
    // ==========================================
    const nodeCount = 38;
    const nodePositions: THREE.Vector3[] = [];
    const nodeColors: number[] = [];

    // Arrange nodes in clustered 3D neural layers
    for (let i = 0; i < nodeCount; i++) {
      // Layer depth index (0: input, 1: hidden 1, 2: hidden 2, 3: output)
      const layer = (i % 4) - 1.5;
      const x = layer * 14 + (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 12 - 4;
      const z = (Math.random() - 0.5) * 16 - 5;

      nodePositions.push(new THREE.Vector3(x, y, z));

      // Color variation across nodes
      const chosenColor = i % 3 === 0 ? colors.nodeA : i % 3 === 1 ? colors.nodeB : colors.nodeC;
      nodeColors.push(chosenColor.r, chosenColor.g, chosenColor.b);
    }

    const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
    nodeGeo.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 1.4,
      map: chalkTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // Build Synaptic Edges between nearby nodes
    const edgePoints: THREE.Vector3[] = [];
    const maxConnectionDist = 14;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxConnectionDist) {
          edgePoints.push(nodePositions[i], nodePositions[j]);
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePoints);
    const edgeMat = new THREE.LineBasicMaterial({
      color: colors.edges,
      transparent: true,
      opacity: colors.edgeOpacity,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edgeLines);

    // Dynamic Synaptic Pulses (packets traveling along edges)
    const pulseCount = 14;
    const pulseProgress = new Float32Array(pulseCount);
    const pulseEdgeIndices = new Int32Array(pulseCount);
    const numEdges = edgePoints.length / 2;

    for (let p = 0; p < pulseCount; p++) {
      pulseProgress[p] = Math.random();
      pulseEdgeIndices[p] = Math.floor(Math.random() * numEdges);
    }

    const pulseGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 1.8,
      color: colors.pulseColor,
      map: chalkTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsePoints);

    // ==========================================
    // 3. ATMOSPHERIC CHALK DUST FIELD
    // ==========================================
    const dustCount = window.innerWidth < 768 ? 160 : 360;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 80;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.018 + 0.005, // gentle upward drift
        z: (Math.random() - 0.5) * 0.012,
      });
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 1.1,
      color: colors.dust,
      map: chalkTexture,
      transparent: true,
      opacity: colors.dustOpacity,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // ==========================================
    // MOUSE PARALLAX & PHYSICS
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ==========================================
    // VISIBILITY / INTERSECTION OBSERVER (0% CPU OFF-SCREEN)
    // ==========================================
    let isVisible = true;
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId && !prefersReducedMotion) {
          lastTime = performance.now();
          renderLoop(lastTime);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ==========================================
    // RENDER / ANIMATION LOOP
    // ==========================================
    let clock = new THREE.Clock();
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      if (!isVisible || prefersReducedMotion) {
        animationFrameId = 0;
        return;
      }

      const delta = (now - lastTime) * 0.001;
      lastTime = now;
      const t = clock.getElapsedTime();

      // Check theme updates dynamically
      const currentColors = getThemeColors(themeRef.current);
      terrainMat.color.lerp(currentColors.terrain, 0.05);
      terrainMat.opacity = THREE.MathUtils.lerp(terrainMat.opacity, currentColors.terrainOpacity, 0.05);
      edgeMat.color.lerp(currentColors.edges, 0.05);
      edgeMat.opacity = THREE.MathUtils.lerp(edgeMat.opacity, currentColors.edgeOpacity, 0.05);
      dustMat.color.lerp(currentColors.dust, 0.05);
      dustMat.opacity = THREE.MathUtils.lerp(dustMat.opacity, currentColors.dustOpacity, 0.05);
      pulseMat.color.lerp(currentColors.pulseColor, 0.05);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Parallax Camera Sway
      camera.position.x = mouse.x * 6;
      camera.position.y = 12 + mouse.y * 3.5;
      camera.lookAt(0, 0, 0);

      // 1. Undulate Mathematical Loss Terrain
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const initX = initialPositions[i];
        const initY = initialPositions[i + 1];

        // Actuarial loss surface formula (Poisson/Gamma topological waves)
        const wave1 = Math.sin(initX * 0.12 + t * 0.7) * Math.cos(initY * 0.14 + t * 0.5) * 2.2;
        const wave2 = Math.sin((initX + initY) * 0.08 + t * 0.4) * 1.3;
        const mouseProximity = Math.exp(
          -((initX - mouse.x * 25) ** 2 + (initY - mouse.y * 15) ** 2) / 300
        );

        positions[i + 2] = initialPositions[i + 2] + wave1 + wave2 + mouseProximity * 2.8;
      }
      posAttr.needsUpdate = true;

      // 2. Animate Neural Synaptic Pulses
      const pulsePosArr = pulseGeo.attributes.position.array as Float32Array;
      for (let p = 0; p < pulseCount; p++) {
        pulseProgress[p] += delta * 0.55;
        if (pulseProgress[p] > 1) {
          pulseProgress[p] = 0;
          pulseEdgeIndices[p] = Math.floor(Math.random() * numEdges);
        }

        const edgeIdx = pulseEdgeIndices[p];
        const p1 = edgePoints[edgeIdx * 2];
        const p2 = edgePoints[edgeIdx * 2 + 1];
        if (p1 && p2) {
          const prog = pulseProgress[p];
          pulsePosArr[p * 3] = p1.x + (p2.x - p1.x) * prog;
          pulsePosArr[p * 3 + 1] = p1.y + (p2.y - p1.y) * prog;
          pulsePosArr[p * 3 + 2] = p1.z + (p2.z - p1.z) * prog;
        }
      }
      pulseGeo.attributes.position.needsUpdate = true;

      // Rotate neural constellation slightly
      nodePoints.rotation.y = Math.sin(t * 0.15) * 0.08 + mouse.x * 0.1;
      edgeLines.rotation.y = nodePoints.rotation.y;
      pulsePoints.rotation.y = nodePoints.rotation.y;

      // 3. Float Chalk Dust Field
      const dustPosArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        const vel = dustVelocities[i];
        dustPosArr[i * 3] += vel.x;
        dustPosArr[i * 3 + 1] += vel.y;
        dustPosArr[i * 3 + 2] += vel.z;

        // Wrap around boundaries
        if (dustPosArr[i * 3 + 1] > 25) dustPosArr[i * 3 + 1] = -20;
        if (dustPosArr[i * 3] > 42) dustPosArr[i * 3] = -42;
        if (dustPosArr[i * 3] < -42) dustPosArr[i * 3] = 42;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Render single frame if prefersReducedMotion
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      if (prefersReducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      terrainGeo.dispose();
      terrainMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      chalkTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    />
  );
}
