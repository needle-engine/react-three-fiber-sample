import { createElement, ReactElement, useEffect, useState } from 'react'
import { useFrame, useThree } from "@react-three/fiber";
import { Object3D } from 'three';
import { Context, loadSync, GameObject, getParam, Camera } from '@needle-tools/engine';

// TODO: provide path to glb via props

const onLoadingCallback = (_) => {
    // console.log(callback.name, callback.progress.loaded / callback.progress.total, callback.index + "/" + callback.count);
};

export type NeedleEngineProps = {
    src?: string
}

export function NeedleEngine(props: NeedleEngineProps): ReactElement {
    const debug = getParam("debugr3fneedle");

    const [state, setState] = useState<{ context?: Context }>({ context: undefined });
    const three = useThree();

    useEffect(() => {
        if (!state.context) {
            const newContext = new Context({ name: "Needle Scene", alias: "needle-r3f", domElement: three.gl.domElement.parentElement, renderer: three.gl, camera: three.camera });
            newContext.isManagedExternally = true
            let srcFiles = props?.src ?? globalThis["needle:codegen_files"];
            if (typeof srcFiles === "string") srcFiles = [srcFiles];
            if (srcFiles) {
                newContext.create({
                    files: srcFiles,
                    onLoadingProgress: onLoadingCallback,
                });
            }
            setState({ context: newContext });
        }

        return () => {
            if (debug) console.log("Needle Engine Unmount");
        };
    }, []);

    useEffect(() => {
        if (state.context) {
            root.add(state.context.scene);
        }
    });

    let totalTime = 0;
    useFrame((_, delta, xrframe) => {
        totalTime += delta;
        if (state.context) {
            state.context.targetFrameRate = undefined;
            state.context.update(totalTime, xrframe);
        }
    });

    const root = new Object3D();
    root.name = "Needle Engine Scene Root";
    return createElement('primitive', { object: root }, null);;
}