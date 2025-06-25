// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

addMatchImageSnapshotCommand()

addMatchImageSnapshotCommand({
	customSnapshotsDir: 'cypress/snapshots/baselines',
	customDiffDir: 'cypress/snapshots/__diffs__',
	failureThreshold: 0.1, // Допустимо 0.1% отличий (дефолт обычно 0)
	failureThresholdType: 'percent', // или 'pixels'
	customDiffConfig: { threshold: 0.1 }, // Для алгоритма сравнения
})