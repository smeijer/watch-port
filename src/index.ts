/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,no-console,@typescript-eslint/unbound-method */
import { spawn } from 'node:child_process';
import type n from 'node:net';
import { parseArgs } from 'node:util';

// @ts-expect-error no types available, extends node:net
import net from 'net-socket';

const { values } = parseArgs({
	options: {
		script: { type: 'string', short: 's' },
		port: { type: 'string', short: 'p', default: '3000' },
		host: { type: 'string', short: 'h', default: '127.0.0.1' },
	},
});

if (!values.script || !values.port) {
	console.error('Usage: node watch.js --script <script-path> --port <port> [--host <host>]');
	process.exit(1);
}

function runScript() {
	const args = values.script!.split(' ');
	const command = args.shift();
	spawn(command!, args, { stdio: 'inherit' });
}

const socket: n.Socket = net.connect({
	port: Number(values.port),
	host: '127.0.0.1',
});

let connected = false;

socket.on('connect', () => {
	connected = true;
	console.log(`[watch-port] connected to ${values.host}:${values.port}`);
	runScript();
});

socket.on('close', () => {
	if (!connected) return;
	connected = false;
	console.log(`[watch-port] disconnected`);
});

function destroy() {
	if (socket.destroyed) return;
	socket.destroy();
}

process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);
process.on('SIGQUIT', destroy);
