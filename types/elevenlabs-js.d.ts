declare module '@elevenlabs/elevenlabs-js' {
    export class ElevenLabsClient {
        constructor(apiKey: string);
        
        // Add other methods you're using
        generateAudio(text: string, voiceId: string): Promise<Buffer>;
    }
}
