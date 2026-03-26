import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Canvas, useThree } from '@react-three/fiber';
import { Box, Plane, MeshRefractionMaterial } from '@react-three/drei';
import { MeshBasicMaterial, AmbientLight, DirectionalLight, GridHelper } from 'three';
import * as THREE from 'three';
import { useMemo } from 'react';
import { Input } from './retroui/Input';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "./ui/field";
import { Button } from './retroui/Button';

// Define the form schema
const formSchema = z.object({
    citySize: z.number().min(10).max(500).default(100),
    buildingCount: z.number().min(5).max(200).default(50),
    highRisePercentage: z.number().min(0).max(100).default(30),
    lowBuildingHeight: z.number().min(1).max(20).default(5),
    highBuildingHeight: z.number().min(10).max(100).default(30),
});

// Types for form values
type FormValues = z.infer<typeof formSchema>;

export function CityGenerator() {
    const form = useForm({
        validators: {
            onSubmit: formSchema
        },
        defaultValues: {
            citySize: 100,
            buildingCount: 50,
            highRisePercentage: 30,
            lowBuildingHeight: 5,
            highBuildingHeight: 30,
        },
    });

    const { size } = useThree();

    // Generate buildings based on form values
    const buildings = useMemo(() => {
        const citySize = form.getFieldValue('citySize');
        const buildingCount = form.getFieldValue('buildingCount');
        const highRisePercentage = form.getFieldValue('highRisePercentage');
        const lowBuildingHeight = form.getFieldValue('lowBuildingHeight');
        const highBuildingHeight = form.getFieldValue('highBuildingHeight');
        const buildings: { position: [number, number, number]; size: [number, number, number]; color: number }[] = [];

        for (let i = 0; i < buildingCount; i++) {
            // Random position within city bounds
            const x = (Math.random() - 0.5) * citySize;
            const z = (Math.random() - 0.5) * citySize;
            const y = 0; // Buildings sit on ground

            // Determine if this is a high rise building
            const isHighRise = Math.random() * 100 < highRisePercentage;
            const height = isHighRise
                ? lowBuildingHeight + Math.random() * (highBuildingHeight - lowBuildingHeight)
                : 1 + Math.random() * lowBuildingHeight;

            // Building footprint (width and depth)
            const width = 2 + Math.random() * 8;
            const depth = 2 + Math.random() * 8;

            // Random color for building (concrete/glass tones)
            const color = Math.random() * 0xffffff;

            buildings.push({
                position: [x, y, z],
                size: [width, height, depth],
                color,
            });
        }

        return buildings;
    }, [form.getFieldValue('citySize'), form.getFieldValue('buildingCount'), form.getFieldValue('highRisePercentage'), form.getFieldValue('lowBuildingHeight'), form.getFieldValue('highBuildingHeight')]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
            {/* Form controls */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: 15,
                borderRadius: 8,
                zIndex: 10
            }}>
                <h3>City Generator</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit((data) => {
                        console.log('Form submitted:', data);
                    });
                }}>
                    <FieldGroup>
                        <form.Field 
                            name="citySize"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>City Size: </FieldLabel>
                                        <Input 
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            aria-invalid={isInvalid}
                                        />
                                        <FieldDescription>
                                            Enter a number representing size of a city ranging from small town (10) to massive metropolis (500) and an average city size of (100)
                                        </FieldDescription>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field 
                            name="buildingCount"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Building Count: </FieldLabel>
                                        <Input 
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            aria-invalid={isInvalid}
                                        />
                                        <FieldDescription>
                                            Enter the number of buildings to generate
                                        </FieldDescription>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field 
                            name="highRisePercentage"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>High Rise %: </FieldLabel>
                                        <Input 
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            aria-invalid={isInvalid}
                                        />
                                        <FieldDescription>
                                            Enter the percentage of high-rise buildings
                                        </FieldDescription>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field 
                            name="lowBuildingHeight"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Low Building Height: </FieldLabel>
                                        <Input 
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            aria-invalid={isInvalid}
                                        />
                                        <FieldDescription>
                                            Enter the minimum height for low-rise buildings
                                        </FieldDescription>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                        <form.Field 
                            name="highBuildingHeight"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>High Building Height: </FieldLabel>
                                        <Input 
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            aria-invalid={isInvalid}
                                        />
                                        <FieldDescription>
                                            Enter the maximum height for high-rise buildings
                                        </FieldDescription>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                )
                            }}
                        />

                    </FieldGroup>
                    <Button type="submit" style={{ marginTop: 10 }}>Generate City</Button>
                </form>
            </div>

            {/* Three.js Canvas */}
            <Canvas
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 50, 100], fov: 60 }}
            >
                {/* Lights */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 10]} intensity={0.8} />

                {/* Ground */}
                <Plane
                    rotation={[-Math.PI / 2, 0, 0]}
                    args={[1000, 1000, 1000]}
                    material={new MeshBasicMaterial({ color: 0x202020 })}
                />

                {/* Buildings */}
                {buildings.map((building, index) => (
                    <Box
                        key={index}
                        position={building.position}
                        args={building.size}
                        material-color={building.color}
                    />
                ))}

                {/* Helper grid for reference */}
                <gridHelper args={[1000, 100, 0x444444, 0x888888]} />
            </Canvas>
        </div>
    );
}