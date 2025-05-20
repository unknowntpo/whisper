import { useEffect, useState, useMemo } from "react";

function useBroadcastChannel(channelName: string) {
	const [message, setMessage] = useState('');
	const channel = useMemo(() => new BroadcastChannel(channelName), [channelName]);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			setMessage(event.data);
		}

		channel.onmessage = handleMessage;
	}, [channel]);

	const sendMessage = (msg: string) => {
		channel.postMessage(msg);
	}

	return {message, sendMessage};
}

export {useBroadcastChannel};
