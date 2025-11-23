import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { useRef, Suspense, useMemo } from "react";

export const StarBackground = (props) => {
  const ref = useRef(null);
  
  // Usar useMemo para asegurar que el array se crea solo una vez y es válido
  const sphere = useMemo(() => {
    try {
      const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 });
      
      // Verificar y limpiar NaN values
      for (let i = 0; i < positions.length; i++) {
        if (!isFinite(positions[i])) {
          positions[i] = 0;
        }
      }
      
      return positions;
    } catch (error) {
      console.error('Error generating star positions:', error);
      // Retornar array vacío si hay error
      return new Float32Array(0);
    }
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  // No renderizar si no hay posiciones válidas
  if (sphere.length === 0) {
    return null;
  }

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        stride={3}
        positions={sphere}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      gl={{ antialias: false }}
      camera={{ position: [0, 0, 1] }}
    >
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;