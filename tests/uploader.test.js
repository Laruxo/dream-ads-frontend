import {mount} from '@vue/test-utils';
import Uploader from '../src/components/Uploader';
import flushPromises from 'flush-promises';

describe('Uploader', () => {
  test('should contain upload input', () => {
    const component = mount(Uploader);
    expect(component.html()).toContain('id="ads-json"');
  });

  test('should not handle random file', () => {
    const component = mount(Uploader);
    expect(component.emitted('uploaded')).toBeFalsy();
  });

  test('should work with json file', async() => {
    const component = mount(Uploader, {
      methods: {
        handleFile() {
          const file = new Blob(['{}'], {type: 'application/json'});
          this.parseFileContents(file);
        },
      },
    });
    const input = component.find('#ads-json');
    input.trigger('change');

    await flushPromises();
    await flushPromises();

    expect(component.emitted('uploaded').length).toBe(1);
  });
});
