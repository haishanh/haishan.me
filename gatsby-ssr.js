/**
 *
 * see
 * https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-react-helmet/src/gatsby-ssr.js
 * https://www.gatsbyjs.org/docs/ssr-apis/#onRenderBody
 *
 */
import { Helmet } from 'react-helmet';

export const onRenderBody = ({
  setHeadComponents,
  setHtmlAttributes,
  setBodyAttributes
}) => {
  const helmet = Helmet.renderStatic();
  // These action functions were added partway through the Gatsby 1.x cycle.
  if (setHtmlAttributes) {
    setHtmlAttributes(helmet.htmlAttributes.toComponent());
  }
  if (setBodyAttributes) {
    setBodyAttributes(helmet.bodyAttributes.toComponent());
  }
  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent(),
    helmet.noscript.toComponent(),
    helmet.script.toComponent(),
    helmet.style.toComponent(),
    helmet.base.toComponent()
  ]);
};
