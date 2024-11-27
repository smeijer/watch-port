/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,no-console,@typescript-eslint/unbound-method */
import { spawn } from 'node:child_process';
import type n from 'node:net';
import { parseArgs } from 'node:util';

// @ts-expect-error no types available, extends node:net
import net from 'net-socket';

const { values } = parseArgs({
	options: {
		command: { type: 'string', short: 'c' },
		port: { type: 'string', short: 'p', default: '3000' },
		host: { type: 'string', short: 'h', default: '127.0.0.1' },
	},
});

if (!values.command || !values.port) {
	console.error('Usage: watch-port --command <command> --port <port> [--host <host>]');
	process.exit(1);
}

function runCommand() {
	const args = values.command!.split(' ');
	const command = args.shift();
	spawn(command!, args, { stdio: 'inherit' });
}

const socket: n.Socket = net.connect({
	port: Number(values.port),
	host: values.host,
});

let connected = false;

socket.on('connect', () => {
	connected = true;
	console.log(`[watch-port] connected to ${values.host}:${values.port}`);
	runCommand();
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
