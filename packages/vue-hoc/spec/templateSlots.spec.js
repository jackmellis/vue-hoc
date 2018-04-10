import test from 'ava';
import {mount} from 'vuenit';
import {createHOC} from '../src';

const Component = {
  template : `<div>
                <div id="default"><slot>component default slot</slot></div>
                <div id="named"><slot name="named_slot">component named slot</slot></div>
              </div>`
};
mount(Component);

test('passes named slots by `template` tag', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      named_slot: '<template>hoc template slot</template>'
    }
  });
  t.true(vm.$findOne('#named').$text === 'hoc template slot');
});

test('passes default slots by `template` tag', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      default: '<template>default slot</template>'
    }
  });
  t.true(vm.$findOne('#default').$text === 'default slot');
});

test('passes both default slots and named slots by `template` tag', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      default: '<template>default slot</template>',
      named_slot: '<template>hoc template slot</template>'
    }
  });
  t.true(vm.$findOne('#default').$text === 'default slot');
  t.true(vm.$findOne('#named').$text === 'hoc template slot');
});

test('passes default slots by `div` tag and named slots by `template` tag', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      default: '<div>default slot</div>',
      named_slot: '<template>hoc template slot</template>'
    }
  });

  t.true(vm.$findOne('#default').$html === '<div id="default"><div>default slot</div></div>');
  t.true(vm.$findOne('#named').$html === '<div id="named">hoc template slot</div>');
});

test('passes named slots by `div` tag and default slots by `template` tag', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      default: '<template>default slot</template>',
      named_slot: '<div>hoc template slot</div>'
    }
  });

  t.true(vm.$findOne('#default').$html === '<div id="default">default slot</div>');
  t.true(vm.$findOne('#named').$html === '<div id="named"><div>hoc template slot</div></div>');
});

test('passes named template slots through multiple hocs', t => {
  const hoc1 = createHOC(Component);
  const hoc2 = createHOC(hoc1);
  const vm = mount(hoc2, {
    slots: {
      named_slot: '<template>hoc template slot</template>'
    }
  });
  t.true(vm.$findOne('#named').$text === 'hoc template slot');
});
