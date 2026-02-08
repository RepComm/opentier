import { render } from 'preact';
import { LocationProvider } from 'preact-iso';

import { Router, Route } from "wouter";
import { useHashLocation } from "wouter/use-hash-location"

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import './style.css';
import { Tier } from './pages/tier/index.js';

window.addEventListener("wheel", (evt)=>{
	evt.preventDefault();
}, {passive: false })
window.addEventListener("touchstart", (evt)=>{
	evt.preventDefault();
}, { passive: false })

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main>
				<Router hook={useHashLocation}>
					<Route path="/" component={Home} />
					<Route path="/:tierid" component={Tier} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
