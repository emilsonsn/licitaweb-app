import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'jsonPath'
})
export class JsonPathPipe implements PipeTransform {

  transform(value: any, path: string): any {
    if (!value || !path) {
      // console.log('❌ Valor ou caminho inválido:', { value, path });
      return null;
    }

    // console.log('🔍 Valor inicial:', value);
    // console.log('📍 Caminho:', path);

    // Verifica se o valor é uma string JSON e faz o parse
    if (typeof value === 'string') {
      try {
        // console.log('🔄 Tentando fazer JSON.parse no valor...');
        value = JSON.parse(value);
        // console.log('✅ JSON parseado com sucesso:', value);
      } catch (e) {
        // console.error('❌ Falha ao fazer JSON.parse:', e);
        return null;
      }
    }

    // Navega pelo caminho fornecido
    const result = path.split('.').reduce((acc, key, index) => {
      // console.log(`🔧 Etapa ${index + 1} - Chave: ${key}, Valor atual:`, acc);
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, value);

    // console.log('✅ Resultado final:', result);

    return result;
  }
}
