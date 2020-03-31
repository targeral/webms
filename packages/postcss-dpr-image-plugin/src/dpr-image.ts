import postcss, { atRule, AtRule, Rule } from 'postcss'
import { IOption, Dpr } from './interface'

const defaultOption: IOption = {
  rules: []
}

const plugin = postcss.plugin('postcss-dpr-image', function(
  opts: IOption = defaultOption
) {
  // Work with options here
  const newRules: Rule[] = []
  return function(root, result) {
    opts.rules.forEach(dprRule => {
      root.walkRules(function(rule) {
        rule.walkDecls('background-url', function(decl) {
          const dpr: Dpr = dprRule.dpr

          const d = postcss.decl({
            prop: decl.prop,
            value: decl.value.replace('.png', '@2x.png')
          })
          const r = postcss.rule({ selector: rule.selector })
          r.append(d)
          newRules.push(r)
        })
      })
    })
    // root.walkRules(function (rule) {
    //     rule.walkDecls('background-url', function (decl) {
    //         const d = postcss.decl({ prop: decl.prop, value: decl.value.replace('.png', '@2x.png') });
    //         const r = postcss.rule({ selector: rule.selector });
    //         r.append(d);
    //         newRules.push(r);
    //     });
    // });
    newRules.forEach(rule => {
      root.append(
        atRule({
          name: 'media',
          params: 'screen and (max-width: 320px)',
          raws: {
            before: '\n'
          }
        })
      )
      ;(<AtRule>root.last).append(rule)
    })
  }
})

export { plugin }
