import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const WebRTCModule = ({ chatId, type, socket, onClose }) => {
    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(type === 'voice');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                // Signal the customer that we want to start a call
                socket.emit('call_request', { chatId, type });
            });

        socket.on('call_accepted', (data) => {
            const peer = new Peer({ initiator: true, trickle: false, stream });

            peer.on('signal', (signal) => {
                socket.emit('webrtc_offer', { to: data.from, offer: signal });
            });

            peer.on('stream', (remoteStream) => {
                setRemoteStream(remoteStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = remoteStream;
                }
            });

            socket.on('webrtc_answer', (answer) => {
                peer.signal(answer);
            });

            connectionRef.current = peer;
        });

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (connectionRef.current) connectionRef.current.destroy();
        };
    }, []);

    const toggleMute = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        if (type === 'video') {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="w-[800px] h-[500px] bg-[#1e293b] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-white/10">
            {/* Remote Video (Full Screen) */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
                {remoteStream ? (
                    <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <PhoneOff size={40} className="text-primary-400" />
                        </div>
                        <p className="text-slate-400 font-medium">Waiting for customer to join...</p>
                    </div>
                )}

                {/* Local Video (Floating) */}
                <div className="absolute bottom-6 right-6 w-48 h-32 bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                    <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Controls */}
            <div className="p-8 flex justify-center items-center space-x-6 bg-slate-900 border-t border-white/10">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                {type === 'video' && (
                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
                >
                    <PhoneOff size={30} />
                </button>
            </div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default WebRTCModule;
