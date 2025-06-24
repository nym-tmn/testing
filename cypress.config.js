import { defineConfig } from 'cypress'
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin'

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			addMatchImageSnapshotPlugin(on)
			if (config.env.storybook) {
				config.baseUrl = 'http://localhost:6006'
				config.specPattern = 'cypress/e2e/storybook/**/*.{js,jsx,ts,tsx}'
			} else {
				config.specPattern = 'cypress/e2e/app/**/*.{js,jsx,ts,tsx}'
				config.baseUrl = 'http://localhost:5173'
			}
			return config
		}
	}
})