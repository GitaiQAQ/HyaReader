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
      url: 'https://raw.githubusercontent.com/GitaiQAQ/HyaReader/gh-pages/static/楚辞.txt',
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
      if (toc) state.book.toc.push(toc);
    },
    UPDATE_BOOK_PAGE: (state, { page }) => {
      if (page) state.book.pages.push(page);
    },
  },
  getters: {
    isWrapper: state => !state.book.meta.length,
    isLoading: state => !state.book.pages.length,
    title: state => state.book.meta.title,
    toc: state => state.book.toc,
  },
  actions: {
    UPDATE_BOOK_META({ commit }, meta) {
      commit('UPDATE_BOOK_META', meta);
    },
    UPDATE_BOOK_HTML({ commit }, html) {
      commit('UPDATE_BOOK_HTML', html);
    },
    UPDATE_BOOK_TREE({ commit }, tree) {
      commit('UPDATE_BOOK_TREE', tree);
    },
    UPDATE_BOOK_URL({ commit }, url) {
      commit('UPDATE_BOOK_URL', url);
    },
    UPDATE_BOOK_TOC({ commit }, toc) {
      commit('UPDATE_BOOK_TOC', toc);
    },
    UPDATE_BOOK_PAGE({ commit }, page) {
      commit('UPDATE_BOOK_PAGE', page);
    },
  },
});
