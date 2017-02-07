/* eslint no-param-reassign: ["error", { "props": false }] */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reader: {
      fontSize: 16,     // px
      lineHeight: 1.5,  // em
      vertical: false,
    },
    book: {
      url: './static/楚辞.txt',
      tree: [],
      meta: [],
      toc: [],
      pages: [],
      html: null,
    },
  },
  mutations: {
    UPDATE_LAYOUT_MODE: (state, { mode }) => {
      if (!mode) state.reader.vertical = !state.reader.vertical;
      else if (mode === 'layout-vertical') state.reader.vertical = true;
      else if (mode === 'layout-horizontal') state.reader.vertical = false;
    },
    UPDATE_BOOK_URL: (state, { url }) => {
      if (url) state.book.url = url;
    },
    UPDATE_BOOK_META: (state, { meta }) => {
      if (meta) state.book.meta = meta;
    },
    UPDATE_BOOK_TREE: (state, { tree }) => {
      if (tree) state.book.tree = tree;
    },
    UPDATE_BOOK_HTML: (state, { html }) => {
      if (html) state.book.html = html;
    },
    UPDATE_BOOK_TOC: (state, { toc }) => {
      if (toc) state.book.toc = toc;
    },
    UPDATE_BOOK_PAGES: (state, { pages }) => {
      if (pages) state.book.pages = pages;
    },
  },
  getters: {
    isLoading: state => !state.book.pages.length,
    title: state => state.book.meta.title,
  },
});
