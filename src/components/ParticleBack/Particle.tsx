import React from "react";
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import { loadPolygonMaskPlugin } from "tsparticles-plugin-polygon-mask";

const ParticleGenerator = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadPolygonMaskPlugin(engine);
        console.log(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    const options:any = {
        detectRetina: false,
        fpsLimit: 120,
        interactivity: {
            detectsOn: "canvas",
            events: {
                onHover: {
                    enable: true,
                    mode: "bubble"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 40,
                    duration: 5,
                    opacity: 8,
                    size: 10,
                    speed: 3
                }
            }
        },
        particles: {
            color: {
                value: "#ffffff",
                animation: {
                    enable: false,
                    speed: 20,
                    sync: true
                }
            },
            lineLinked: {
                blink: false,
                color: "random",
                consent: false,
                distance: 25,
                enable: true,
                opacity: 0.3,
                width: 0.4
            },
            move: {
                attract: {
                    enable: false,
                    rotate: {
                        x: 600,
                        y: 1200
                    }
                },
                bounce: false,
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: true,
                speed: 0.5,
                straight: false
            },
            number: {
                density: {
                    enable: false,
                    area: 2000
                },
                limit: 0,
                value: 200
            },
            opacity: {
                animation: {
                    enable: true,
                    minimumValue: 0.05,
                    speed: 6,
                    sync: false
                },
                random: false,
                value: 1
            },
            shape: {
                type: "circle"
            },
            size: {
                animation: {
                    enable: false,
                    minimumValue: 2,
                    speed: 40,
                    sync: true 
                },
                random: true,
                value: 1
            }
        },
        polygon: {
            draw: {
                enable: true,
                lineColor: "rgba(255,255,255,0.2)",
                lineWidth: 0.3
            },
            move: {
                radius: 10
            },
            inlineArrangement: "equidistant",
            scale: 0.5,
            type: "inline",
            url: "https://particles.js.org/images/smalldeer.svg"
        }
    }


    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={options}        />
    );
};

export default ParticleGenerator;