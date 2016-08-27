import chai from 'chai';
import lessful, {parse} from '../src/lessful';
const {assert} = chai;

export default function () {

  describe('should work with colors', function () {
    it('import lessful', function() {
      assert.isOk(lessful);
    });
    it('parse color', function() {
      const color = parse('fade(rgba(2, 2, 2, .4), 87%)');
      console.log(color);
      console.log(color.toCSS());
    });
  });
}
