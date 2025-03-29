import { setApplication } from '@ember/test-helpers';
import { setupEmberOnerrorValidation, start } from 'ember-qunit';
import { loadTests } from 'ember-qunit/test-loader';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import Application from 'ui/app';
import config from 'ui/config/environment';
import { setupRequestMocking } from './msw/test-support';

setApplication(Application.create(config.APP));

setupRequestMocking();

setup(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();
start();
