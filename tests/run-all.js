// Roda os 4 arquivos de teste na ordem que as dependências entre eles exigem
// (templates.test.js precisa rodar antes de sistema.test.js, que reaproveita
// o HTML processado; sistema.test.js reaproveita o contexto de
// integracao.test.js). Cada arquivo lança (assert) no primeiro caso que
// falhar — não tem "continua mesmo com erro" de propósito, pra nunca esconder
// uma falha atrás de outra.
'use strict';
require('./unitario.test.js');
require('./templates.test.js');
require('./integracao.test.js');
require('./sistema.test.js');
console.log('Tudo passou.');
