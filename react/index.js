'use client';
import { createElement, useEffect, useRef } from 'react';
import { SandKit } from '../src/index.js';
/** Memoize shapes to avoid unnecessary resampling. Options may update independently. */
export function SandCanvas({ shapes, options, pin = null, onError = console.warn, className, style, ...props }) {
    const canvas = useRef(null), instance = useRef(null), errors = useRef(onError);
    errors.current = onError;
    useEffect(() => {
        let kit;
        try {
            kit = new SandKit(canvas.current, { shapes, options, onError: e => errors.current(e) });
            instance.current = kit;
            kit.pin(pin);
            kit.ready.catch(e => errors.current(e));
        }
        catch (error) {
            errors.current(error);
        }
        return () => { kit?.dispose(); instance.current = null; };
    }, [shapes]);
    useEffect(() => { instance.current?.setOptions(options ?? {}).catch(e => errors.current(e)); }, [options]);
    useEffect(() => { instance.current?.pin(pin); }, [pin]);
    return createElement('canvas', { ...props, ref: canvas, className, style: { width: '100%', height: '100%', ...style }, 'aria-hidden': true });
}
