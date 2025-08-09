import {
  Headers as Headers2,
  browser_default,
  browser_exports,
  init_browser
} from "/build/_shared/chunk-LFAKDRIB.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-F4KNNEUR.js";
import {
  require_react
} from "/build/_shared/chunk-2Z2JGDFU.js";
import {
  createHotContext
} from "/build/_shared/chunk-E7FOCUHM.js";
import "/build/_shared/chunk-JR22VO6P.js";
import {
  __commonJS,
  __require,
  __toCommonJS,
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js
var require_PostgrestError = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestError2 = class extends Error {
      constructor(context) {
        super(context.message);
        this.name = "PostgrestError";
        this.details = context.details;
        this.hint = context.hint;
        this.code = context.code;
      }
    };
    exports.default = PostgrestError2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js
var require_PostgrestBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var node_fetch_1 = __importDefault((init_browser(), __toCommonJS(browser_exports)));
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    var PostgrestBuilder2 = class {
      constructor(builder) {
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = builder.headers;
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = builder.shouldThrowOnError;
        this.signal = builder.signal;
        this.isMaybeSingle = builder.isMaybeSingle;
        if (builder.fetch) {
          this.fetch = builder.fetch;
        } else if (typeof fetch === "undefined") {
          this.fetch = node_fetch_1.default;
        } else {
          this.fetch = fetch;
        }
      }
      /**
       * If there's an error with the query, throwOnError will reject the promise by
       * throwing the error instead of returning it as part of a successful response.
       *
       * {@link https://github.com/supabase/supabase-js/issues/92}
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Set an HTTP header for the request.
       */
      setHeader(name, value) {
        this.headers = Object.assign({}, this.headers);
        this.headers[name] = value;
        return this;
      }
      then(onfulfilled, onrejected) {
        if (this.schema === void 0) {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers["Accept-Profile"] = this.schema;
        } else {
          this.headers["Content-Profile"] = this.schema;
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers["Content-Type"] = "application/json";
        }
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal
        }).then(async (res2) => {
          var _a, _b, _c17;
          let error = null;
          let data = null;
          let count = null;
          let status = res2.status;
          let statusText = res2.statusText;
          if (res2.ok) {
            if (this.method !== "HEAD") {
              const body = await res2.text();
              if (body === "") {
              } else if (this.headers["Accept"] === "text/csv") {
                data = body;
              } else if (this.headers["Accept"] && this.headers["Accept"].includes("application/vnd.pgrst.plan+text")) {
                data = body;
              } else {
                data = JSON.parse(body);
              }
            }
            const countHeader = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
            const contentRange = (_b = res2.headers.get("content-range")) === null || _b === void 0 ? void 0 : _b.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
            if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
              if (data.length > 1) {
                error = {
                  // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                  code: "PGRST116",
                  details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message: "JSON object requested, multiple (or no) rows returned"
                };
                data = null;
                count = null;
                status = 406;
                statusText = "Not Acceptable";
              } else if (data.length === 1) {
                data = data[0];
              } else {
                data = null;
              }
            }
          } else {
            const body = await res2.text();
            try {
              error = JSON.parse(body);
              if (Array.isArray(error) && res2.status === 404) {
                data = [];
                error = null;
                status = 200;
                statusText = "OK";
              }
            } catch (_d) {
              if (res2.status === 404 && body === "") {
                status = 204;
                statusText = "No Content";
              } else {
                error = {
                  message: body
                };
              }
            }
            if (error && this.isMaybeSingle && ((_c17 = error === null || error === void 0 ? void 0 : error.details) === null || _c17 === void 0 ? void 0 : _c17.includes("0 rows"))) {
              error = null;
              status = 200;
              statusText = "OK";
            }
            if (error && this.shouldThrowOnError) {
              throw new PostgrestError_1.default(error);
            }
          }
          const postgrestResponse = {
            error,
            data,
            count,
            status,
            statusText
          };
          return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
          res = res.catch((fetchError) => {
            var _a, _b, _c17;
            return {
              error: {
                message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ""}`,
                hint: "",
                code: `${(_c17 = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c17 !== void 0 ? _c17 : ""}`
              },
              data: null,
              count: null,
              status: 0,
              statusText: ""
            };
          });
        }
        return res.then(onfulfilled, onrejected);
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Override the type of the returned `data` field in the response.
       *
       * @typeParam NewResult - The new type to cast the response data to
       * @typeParam Options - Optional type configuration (defaults to { merge: true })
       * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
       * @example
       * ```typescript
       * // Merge with existing types (default behavior)
       * const query = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ custom_field: string }>()
       *
       * // Replace existing types completely
       * const replaceQuery = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
       * ```
       * @returns A PostgrestBuilder instance with the new type
       */
      overrideTypes() {
        return this;
      }
    };
    exports.default = PostgrestBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js
var require_PostgrestTransformBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    var PostgrestTransformBuilder2 = class extends PostgrestBuilder_1.default {
      /**
       * Perform a SELECT on the query result.
       *
       * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
       * return modified rows. By calling this method, modified rows are returned in
       * `data`.
       *
       * @param columns - The columns to retrieve, separated by commas
       */
      select(columns) {
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (this.headers["Prefer"]) {
          this.headers["Prefer"] += ",";
        }
        this.headers["Prefer"] += "return=representation";
        return this;
      }
      /**
       * Order the query result by `column`.
       *
       * You can call this method multiple times to order by multiple columns.
       *
       * You can order referenced tables, but it only affects the ordering of the
       * parent table if you use `!inner` in the query.
       *
       * @param column - The column to order by
       * @param options - Named parameters
       * @param options.ascending - If `true`, the result will be in ascending order
       * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
       * `null`s appear last.
       * @param options.referencedTable - Set this to order a referenced table by
       * its columns
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.order` : "order";
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
        return this;
      }
      /**
       * Limit the query result by `count`.
       *
       * @param count - The maximum number of rows to return
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
      }
      /**
       * Limit the query result by starting at an offset `from` and ending at the offset `to`.
       * Only records within this range are returned.
       * This respects the query order and if there is no order clause the range could behave unexpectedly.
       * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
       * and fourth rows of the query.
       *
       * @param from - The starting index from which to limit the result
       * @param to - The last index to which to limit the result
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
        const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
        const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      /**
       * Set the AbortSignal for the fetch request.
       *
       * @param signal - The AbortSignal to use for the fetch request
       */
      abortSignal(signal) {
        this.signal = signal;
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be one row (e.g. using `.limit(1)`), otherwise this
       * returns an error.
       */
      single() {
        this.headers["Accept"] = "application/vnd.pgrst.object+json";
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
       * this returns an error.
       */
      maybeSingle() {
        if (this.method === "GET") {
          this.headers["Accept"] = "application/json";
        } else {
          this.headers["Accept"] = "application/vnd.pgrst.object+json";
        }
        this.isMaybeSingle = true;
        return this;
      }
      /**
       * Return `data` as a string in CSV format.
       */
      csv() {
        this.headers["Accept"] = "text/csv";
        return this;
      }
      /**
       * Return `data` as an object in [GeoJSON](https://geojson.org) format.
       */
      geojson() {
        this.headers["Accept"] = "application/geo+json";
        return this;
      }
      /**
       * Return `data` as the EXPLAIN plan for the query.
       *
       * You need to enable the
       * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
       * setting before using this method.
       *
       * @param options - Named parameters
       *
       * @param options.analyze - If `true`, the query will be executed and the
       * actual run time will be returned
       *
       * @param options.verbose - If `true`, the query identifier will be returned
       * and `data` will include the output columns of the query
       *
       * @param options.settings - If `true`, include information on configuration
       * parameters that affect query planning
       *
       * @param options.buffers - If `true`, include information on buffer usage
       *
       * @param options.wal - If `true`, include information on WAL record generation
       *
       * @param options.format - The format of the output, can be `"text"` (default)
       * or `"json"`
       */
      explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
        var _a;
        const options = [
          analyze ? "analyze" : null,
          verbose ? "verbose" : null,
          settings ? "settings" : null,
          buffers ? "buffers" : null,
          wal ? "wal" : null
        ].filter(Boolean).join("|");
        const forMediatype = (_a = this.headers["Accept"]) !== null && _a !== void 0 ? _a : "application/json";
        this.headers["Accept"] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
        if (format === "json")
          return this;
        else
          return this;
      }
      /**
       * Rollback the query.
       *
       * `data` will still be returned, but the query is not committed.
       */
      rollback() {
        var _a;
        if (((_a = this.headers["Prefer"]) !== null && _a !== void 0 ? _a : "").trim().length > 0) {
          this.headers["Prefer"] += ",tx=rollback";
        } else {
          this.headers["Prefer"] = "tx=rollback";
        }
        return this;
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
    };
    exports.default = PostgrestTransformBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js
var require_PostgrestFilterBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    var PostgrestFilterBuilder2 = class extends PostgrestTransformBuilder_1.default {
      /**
       * Match only rows where `column` is equal to `value`.
       *
       * To check if the value of `column` is NULL, you should use `.is()` instead.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is not equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-sensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      like(column, pattern) {
        this.url.searchParams.append(column, `like.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAllOf(column, patterns) {
        this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-insensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      ilike(column, pattern) {
        this.url.searchParams.append(column, `ilike.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAllOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` IS `value`.
       *
       * For non-boolean columns, this is only relevant for checking if the value of
       * `column` is NULL by setting `value` to `null`.
       *
       * For boolean columns, you can also set `value` to `true` or `false` and it
       * will behave the same way as `.eq()`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is included in the `values` array.
       *
       * @param column - The column to filter on
       * @param values - The values array to filter with
       */
      in(column, values) {
        const cleanedValues = Array.from(new Set(values)).map((s) => {
          if (typeof s === "string" && new RegExp("[,()]").test(s))
            return `"${s}"`;
          else
            return `${s}`;
        }).join(",");
        this.url.searchParams.append(column, `in.(${cleanedValues})`);
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * `column` contains every element appearing in `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * every element appearing in `column` is contained by `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is greater than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGt(column, range) {
        this.url.searchParams.append(column, `sr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or greater than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGte(column, range) {
        this.url.searchParams.append(column, `nxl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is less than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLt(column, range) {
        this.url.searchParams.append(column, `sl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or less than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLte(column, range) {
        this.url.searchParams.append(column, `nxr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where `column` is
       * mutually exclusive to `range` and there can be no element between the two
       * ranges.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeAdjacent(column, range) {
        this.url.searchParams.append(column, `adj.${range}`);
        return this;
      }
      /**
       * Only relevant for array and range columns. Match only rows where
       * `column` and `value` have an element in common.
       *
       * @param column - The array or range column to filter on
       * @param value - The array or range value to filter with
       */
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `ov.${value}`);
        } else {
          this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      /**
       * Only relevant for text and tsvector columns. Match only rows where
       * `column` matches the query string in `query`.
       *
       * @param column - The text or tsvector column to filter on
       * @param query - The query text to match with
       * @param options - Named parameters
       * @param options.config - The text search configuration to use
       * @param options.type - Change how the `query` text is interpreted
       */
      textSearch(column, query, { config, type } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config === void 0 ? "" : `(${config})`;
        this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      /**
       * Match only rows where each column in `query` keys is equal to its
       * associated value. Shorthand for multiple `.eq()`s.
       *
       * @param query - The object to filter with, with column names as keys mapped
       * to their filter values
       */
      match(query) {
        Object.entries(query).forEach(([column, value]) => {
          this.url.searchParams.append(column, `eq.${value}`);
        });
        return this;
      }
      /**
       * Match only rows which doesn't satisfy the filter.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to be negated to filter with, following
       * PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
        return this;
      }
      /**
       * Match only rows which satisfy at least one of the filters.
       *
       * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure it's properly sanitized.
       *
       * It's currently not possible to do an `.or()` filter across multiple tables.
       *
       * @param filters - The filters to use, following PostgREST syntax
       * @param options - Named parameters
       * @param options.referencedTable - Set this to filter on referenced tables
       * instead of the parent table
       * @param options.foreignTable - Deprecated, use `referencedTable` instead
       */
      or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.or` : "or";
        this.url.searchParams.append(key, `(${filters})`);
        return this;
      }
      /**
       * Match only rows which satisfy the filter. This is an escape hatch - you
       * should use the specific filter methods wherever possible.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to filter with, following PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
      }
    };
    exports.default = PostgrestFilterBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js
var require_PostgrestQueryBuilder = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var PostgrestQueryBuilder2 = class {
      constructor(url, { headers = {}, schema, fetch: fetch2 }) {
        this.url = url;
        this.headers = headers;
        this.schema = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a SELECT query on the table or view.
       *
       * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
       *
       * @param options - Named parameters
       *
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       *
       * @param options.count - Count algorithm to use to count rows in the table or view.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      select(columns, { head: head2 = false, count } = {}) {
        const method = head2 ? "HEAD" : "GET";
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an INSERT into the table or view.
       *
       * By default, inserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to insert. Pass an object to insert a single row
       * or an array to insert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count inserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. Only applies for bulk
       * inserts.
       */
      insert(values, { count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPSERT on the table or view. Depending on the column(s) passed
       * to `onConflict`, `.upsert()` allows you to perform the equivalent of
       * `.insert()` if a row with the corresponding `onConflict` columns doesn't
       * exist, or if it does exist, perform an alternative action depending on
       * `ignoreDuplicates`.
       *
       * By default, upserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to upsert with. Pass an object to upsert a
       * single row or an array to upsert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
       * duplicate rows are determined. Two rows are duplicates if all the
       * `onConflict` columns are equal.
       *
       * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
       * `false`, duplicate rows are merged with existing rows.
       *
       * @param options.count - Count algorithm to use to count upserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. This only applies when
       * inserting new rows, not when merging with existing rows under
       * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
       */
      upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
        const method = "POST";
        const prefersHeaders = [`resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`];
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (!defaultToNull) {
          prefersHeaders.push("missing=default");
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform an UPDATE on the table or view.
       *
       * By default, updated rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param values - The values to update with
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count updated rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      update(values, { count } = {}) {
        const method = "PATCH";
        const prefersHeaders = [];
        if (this.headers["Prefer"]) {
          prefersHeaders.push(this.headers["Prefer"]);
        }
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
      /**
       * Perform a DELETE on the table or view.
       *
       * By default, deleted rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count deleted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      delete({ count } = {}) {
        const method = "DELETE";
        const prefersHeaders = [];
        if (count) {
          prefersHeaders.push(`count=${count}`);
        }
        if (this.headers["Prefer"]) {
          prefersHeaders.unshift(this.headers["Prefer"]);
        }
        this.headers["Prefer"] = prefersHeaders.join(",");
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
    exports.default = PostgrestQueryBuilder2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/version.js
var require_version = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/version.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = "0.0.0-automated";
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/constants.js
var require_constants = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_HEADERS = void 0;
    var version_1 = require_version();
    exports.DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${version_1.version}` };
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js
var require_PostgrestClient = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    var constants_1 = require_constants();
    var PostgrestClient2 = class {
      // TODO: Add back shouldThrowOnError once we figure out the typings
      /**
       * Creates a PostgREST client.
       *
       * @param url - URL of the PostgREST endpoint
       * @param options - Named parameters
       * @param options.headers - Custom headers
       * @param options.schema - Postgres schema to switch to
       * @param options.fetch - Custom fetch
       */
      constructor(url, { headers = {}, schema, fetch: fetch2 } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.schemaName = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder_1.default(url, {
          headers: Object.assign({}, this.headers),
          schema: this.schemaName,
          fetch: this.fetch
        });
      }
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return new PostgrestClient2(this.url, {
          headers: this.headers,
          schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, { head: head2 = false, get: get2 = false, count } = {}) {
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head2 || get2) {
          method = head2 ? "HEAD" : "GET";
          Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
            url.searchParams.append(name, value);
          });
        } else {
          method = "POST";
          body = args;
        }
        const headers = Object.assign({}, this.headers);
        if (count) {
          headers["Prefer"] = `count=${count}`;
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url,
          headers,
          schema: this.schemaName,
          body,
          fetch: this.fetch,
          allowEmpty: false
        });
      }
    };
    exports.default = PostgrestClient2;
  }
});

// node_modules/@supabase/postgrest-js/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/@supabase/postgrest-js/dist/cjs/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostgrestError = exports.PostgrestBuilder = exports.PostgrestTransformBuilder = exports.PostgrestFilterBuilder = exports.PostgrestQueryBuilder = exports.PostgrestClient = void 0;
    var PostgrestClient_1 = __importDefault(require_PostgrestClient());
    exports.PostgrestClient = PostgrestClient_1.default;
    var PostgrestQueryBuilder_1 = __importDefault(require_PostgrestQueryBuilder());
    exports.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
    var PostgrestFilterBuilder_1 = __importDefault(require_PostgrestFilterBuilder());
    exports.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
    var PostgrestTransformBuilder_1 = __importDefault(require_PostgrestTransformBuilder());
    exports.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
    var PostgrestBuilder_1 = __importDefault(require_PostgrestBuilder());
    exports.PostgrestBuilder = PostgrestBuilder_1.default;
    var PostgrestError_1 = __importDefault(require_PostgrestError());
    exports.PostgrestError = PostgrestError_1.default;
    exports.default = {
      PostgrestClient: PostgrestClient_1.default,
      PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
      PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
      PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
      PostgrestBuilder: PostgrestBuilder_1.default,
      PostgrestError: PostgrestError_1.default
    };
  }
});

// app/routes/_index.tsx
var import_react7 = __toESM(require_react(), 1);

// node_modules/@supabase/functions-js/dist/module/helper.js
var resolveFetch = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => import("/build/_shared/browser-7TFGYQUU.js").then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};

// node_modules/@supabase/functions-js/dist/module/types.js
var FunctionsError = class extends Error {
  constructor(message, name = "FunctionsError", context) {
    super(message);
    this.name = name;
    this.context = context;
  }
};
var FunctionsFetchError = class extends FunctionsError {
  constructor(context) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
  }
};
var FunctionsRelayError = class extends FunctionsError {
  constructor(context) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
  }
};
var FunctionsHttpError = class extends FunctionsError {
  constructor(context) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
  }
};
var FunctionRegion;
(function(FunctionRegion2) {
  FunctionRegion2["Any"] = "any";
  FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion2["ApSouth1"] = "ap-south-1";
  FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion2["CaCentral1"] = "ca-central-1";
  FunctionRegion2["EuCentral1"] = "eu-central-1";
  FunctionRegion2["EuWest1"] = "eu-west-1";
  FunctionRegion2["EuWest2"] = "eu-west-2";
  FunctionRegion2["EuWest3"] = "eu-west-3";
  FunctionRegion2["SaEast1"] = "sa-east-1";
  FunctionRegion2["UsEast1"] = "us-east-1";
  FunctionRegion2["UsWest1"] = "us-west-1";
  FunctionRegion2["UsWest2"] = "us-west-2";
})(FunctionRegion || (FunctionRegion = {}));

// node_modules/@supabase/functions-js/dist/module/FunctionsClient.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var FunctionsClient = class {
  constructor(url, { headers = {}, customFetch, region = FunctionRegion.Any } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = resolveFetch(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(functionName, options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { headers, method, body: functionArgs } = options;
        let _headers = {};
        let { region } = options;
        if (!region) {
          region = this.region;
        }
        const url = new URL(`${this.url}/${functionName}`);
        if (region && region !== "any") {
          _headers["x-region"] = region;
          url.searchParams.set("forceFunctionRegion", region);
        }
        let body;
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
          if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            _headers["Content-Type"] = "application/octet-stream";
            body = functionArgs;
          } else if (typeof functionArgs === "string") {
            _headers["Content-Type"] = "text/plain";
            body = functionArgs;
          } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
            body = functionArgs;
          } else {
            _headers["Content-Type"] = "application/json";
            body = JSON.stringify(functionArgs);
          }
        }
        const response = yield this.fetch(url.toString(), {
          method: method || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch((fetchError) => {
          throw new FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get("x-relay-error");
        if (isRelayError && isRelayError === "true") {
          throw new FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
        let data;
        if (responseType === "application/json") {
          data = yield response.json();
        } else if (responseType === "application/octet-stream") {
          data = yield response.blob();
        } else if (responseType === "text/event-stream") {
          data = response;
        } else if (responseType === "multipart/form-data") {
          data = yield response.formData();
        } else {
          data = yield response.text();
        }
        return { data, error: null, response };
      } catch (error) {
        return {
          data: null,
          error,
          response: error instanceof FunctionsHttpError || error instanceof FunctionsRelayError ? error.context : void 0
        };
      }
    });
  }
};

// node_modules/@supabase/postgrest-js/dist/esm/wrapper.mjs
var import_cjs = __toESM(require_cjs(), 1);
var {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestTransformBuilder,
  PostgrestBuilder,
  PostgrestError
} = import_cjs.default;

// node_modules/@supabase/realtime-js/dist/module/lib/websocket-factory.js
var WebSocketFactory = class {
  /**
   * Dynamic require that works in both CJS and ESM environments
   * Bulletproof against strict ESM environments where require might not be in scope
   * @private
   */
  static dynamicRequire(moduleId) {
    try {
      if (typeof process !== "undefined" && process.versions && process.versions.node) {
        if (typeof __require !== "undefined") {
          return __require(moduleId);
        }
      }
      return null;
    } catch (_a) {
      return null;
    }
  }
  static detectEnvironment() {
    var _a, _b;
    if (typeof WebSocket !== "undefined") {
      return { type: "native", constructor: WebSocket };
    }
    if (typeof globalThis !== "undefined" && typeof globalThis.WebSocket !== "undefined") {
      return { type: "native", constructor: globalThis.WebSocket };
    }
    if (typeof globalThis !== "undefined" && typeof globalThis.WebSocket !== "undefined") {
      return { type: "native", constructor: globalThis.WebSocket };
    }
    if (typeof globalThis !== "undefined" && typeof globalThis.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
      return {
        type: "cloudflare",
        error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
        workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
      };
    }
    if (typeof globalThis !== "undefined" && globalThis.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
      return {
        type: "unsupported",
        error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
        workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
      };
    }
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      const nodeVersion = parseInt(process.versions.node.split(".")[0]);
      if (nodeVersion >= 22) {
        try {
          if (typeof globalThis.WebSocket !== "undefined") {
            return { type: "native", constructor: globalThis.WebSocket };
          }
          const undici = this.dynamicRequire("undici");
          if (undici && undici.WebSocket) {
            return { type: "native", constructor: undici.WebSocket };
          }
          throw new Error("undici not available");
        } catch (err) {
          return {
            type: "unsupported",
            error: `Node.js ${nodeVersion} detected but native WebSocket not found.`,
            workaround: 'Install the "ws" package or check your Node.js installation.'
          };
        }
      }
      try {
        const ws = this.dynamicRequire("ws");
        if (ws) {
          return { type: "ws", constructor: (_b = ws.WebSocket) !== null && _b !== void 0 ? _b : ws };
        }
        throw new Error("ws package not available");
      } catch (err) {
        return {
          type: "unsupported",
          error: `Node.js ${nodeVersion} detected without WebSocket support.`,
          workaround: 'Install the "ws" package: npm install ws'
        };
      }
    }
    return {
      type: "unsupported",
      error: "Unknown JavaScript runtime without WebSocket support.",
      workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
    };
  }
  static getWebSocketConstructor() {
    const env = this.detectEnvironment();
    if (env.constructor) {
      return env.constructor;
    }
    let errorMessage = env.error || "WebSocket not supported in this environment.";
    if (env.workaround) {
      errorMessage += `

Suggested solution: ${env.workaround}`;
    }
    throw new Error(errorMessage);
  }
  static createWebSocket(url, protocols) {
    const WS = this.getWebSocketConstructor();
    return new WS(url, protocols);
  }
  static isWebSocketSupported() {
    try {
      const env = this.detectEnvironment();
      return env.type === "native" || env.type === "ws";
    } catch (_a) {
      return false;
    }
  }
};
var websocket_factory_default = WebSocketFactory;

// node_modules/@supabase/realtime-js/dist/module/lib/version.js
var version = "2.15.0";

// node_modules/@supabase/realtime-js/dist/module/lib/constants.js
var DEFAULT_VERSION = `realtime-js/${version}`;
var VSN = "1.0.0";
var DEFAULT_TIMEOUT = 1e4;
var WS_CLOSE_NORMAL = 1e3;
var MAX_PUSH_BUFFER_SIZE = 100;
var SOCKET_STATES;
(function(SOCKET_STATES2) {
  SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
  SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
  SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
  SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
})(SOCKET_STATES || (SOCKET_STATES = {}));
var CHANNEL_STATES;
(function(CHANNEL_STATES2) {
  CHANNEL_STATES2["closed"] = "closed";
  CHANNEL_STATES2["errored"] = "errored";
  CHANNEL_STATES2["joined"] = "joined";
  CHANNEL_STATES2["joining"] = "joining";
  CHANNEL_STATES2["leaving"] = "leaving";
})(CHANNEL_STATES || (CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function(CHANNEL_EVENTS2) {
  CHANNEL_EVENTS2["close"] = "phx_close";
  CHANNEL_EVENTS2["error"] = "phx_error";
  CHANNEL_EVENTS2["join"] = "phx_join";
  CHANNEL_EVENTS2["reply"] = "phx_reply";
  CHANNEL_EVENTS2["leave"] = "phx_leave";
  CHANNEL_EVENTS2["access_token"] = "access_token";
})(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function(TRANSPORTS2) {
  TRANSPORTS2["websocket"] = "websocket";
})(TRANSPORTS || (TRANSPORTS = {}));
var CONNECTION_STATE;
(function(CONNECTION_STATE2) {
  CONNECTION_STATE2["Connecting"] = "connecting";
  CONNECTION_STATE2["Open"] = "open";
  CONNECTION_STATE2["Closing"] = "closing";
  CONNECTION_STATE2["Closed"] = "closed";
})(CONNECTION_STATE || (CONNECTION_STATE = {}));

// node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
var Serializer = class {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }
    if (typeof rawPayload === "string") {
      return callback(JSON.parse(rawPayload));
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }
  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return { ref: null, topic, event, payload: data };
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/timer.js
var Timer = class {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = void 0;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
    this.timer = void 0;
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
};

// node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
var PostgresTypes;
(function(PostgresTypes2) {
  PostgresTypes2["abstime"] = "abstime";
  PostgresTypes2["bool"] = "bool";
  PostgresTypes2["date"] = "date";
  PostgresTypes2["daterange"] = "daterange";
  PostgresTypes2["float4"] = "float4";
  PostgresTypes2["float8"] = "float8";
  PostgresTypes2["int2"] = "int2";
  PostgresTypes2["int4"] = "int4";
  PostgresTypes2["int4range"] = "int4range";
  PostgresTypes2["int8"] = "int8";
  PostgresTypes2["int8range"] = "int8range";
  PostgresTypes2["json"] = "json";
  PostgresTypes2["jsonb"] = "jsonb";
  PostgresTypes2["money"] = "money";
  PostgresTypes2["numeric"] = "numeric";
  PostgresTypes2["oid"] = "oid";
  PostgresTypes2["reltime"] = "reltime";
  PostgresTypes2["text"] = "text";
  PostgresTypes2["time"] = "time";
  PostgresTypes2["timestamp"] = "timestamp";
  PostgresTypes2["timestamptz"] = "timestamptz";
  PostgresTypes2["timetz"] = "timetz";
  PostgresTypes2["tsrange"] = "tsrange";
  PostgresTypes2["tstzrange"] = "tstzrange";
})(PostgresTypes || (PostgresTypes = {}));
var convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
var convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find((x) => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop(value);
};
var convertCell = (type, value) => {
  if (type.charAt(0) === "_") {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    case PostgresTypes.abstime:
    case PostgresTypes.date:
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime:
    case PostgresTypes.text:
    case PostgresTypes.time:
    case PostgresTypes.timestamptz:
    case PostgresTypes.timetz:
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop(value);
    default:
      return noop(value);
  }
};
var noop = (value) => {
  return value;
};
var toBoolean = (value) => {
  switch (value) {
    case "t":
      return true;
    case "f":
      return false;
    default:
      return value;
  }
};
var toNumber = (value) => {
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
var toJson = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }
  return value;
};
var toArray = (value, type) => {
  if (typeof value !== "string") {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  if (openBrace === "{" && closeBrace === "}") {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    try {
      arr = JSON.parse("[" + valTrim + "]");
    } catch (_) {
      arr = valTrim ? valTrim.split(",") : [];
    }
    return arr.map((val) => convertCell(type, val));
  }
  return value;
};
var toTimestampString = (value) => {
  if (typeof value === "string") {
    return value.replace(" ", "T");
  }
  return value;
};
var httpEndpointURL = (socketUrl) => {
  let url = socketUrl;
  url = url.replace(/^ws/i, "http");
  url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "");
  return url.replace(/\/+$/, "") + "/api/broadcast";
};

// node_modules/@supabase/realtime-js/dist/module/lib/push.js
var Push = class {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = void 0;
    this.ref = "";
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }
  resend(timeout) {
    this.timeout = timeout;
    this._cancelRefEvent();
    this.ref = "";
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }
  send() {
    if (this._hasReceived("timeout")) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    });
  }
  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }
  receive(status, callback) {
    var _a;
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }
    this.recHooks.push({ status, callback });
    return this;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket._makeRef();
    this.refEvent = this.channel._replyEventName(this.ref);
    const callback = (payload) => {
      this._cancelRefEvent();
      this._cancelTimeout();
      this.receivedResp = payload;
      this._matchReceive(payload);
    };
    this.channel._on(this.refEvent, {}, callback);
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(status, response) {
    if (this.refEvent)
      this.channel._trigger(this.refEvent, { status, response });
  }
  destroy() {
    this._cancelRefEvent();
    this._cancelTimeout();
  }
  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = void 0;
  }
  _matchReceive({ status, response }) {
    this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
  }
  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
  REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (REALTIME_PRESENCE_LISTEN_EVENTS = {}));
var RealtimePresence = class {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.enabled = false;
    this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(events.state, {}, (newState) => {
      const { onJoin, onLeave, onSync } = this.caller;
      this.joinRef = this.channel._joinRef();
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach((diff) => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel._on(events.diff, {}, (diff) => {
      const { onJoin, onLeave, onSync } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
    this.onJoin((key, currentPresences, newPresences) => {
      this.channel._trigger("presence", {
        event: "join",
        key,
        currentPresences,
        newPresences
      });
    });
    this.onLeave((key, currentPresences, leftPresences) => {
      this.channel._trigger("presence", {
        event: "leave",
        key,
        currentPresences,
        leftPresences
      });
    });
    this.onSync(() => {
      this.channel._trigger("presence", { event: "sync" });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences;
      }
    });
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key];
      if (currentPresences) {
        const newPresenceRefs = newPresences.map((m) => m.presence_ref);
        const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
        const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
        const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences;
        }
        if (leftPresences.length > 0) {
          leaves[key] = leftPresences;
        }
      } else {
        joins[key] = newPresences;
      }
    });
    return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(state, diff, onJoin, onLeave) {
    const { joins, leaves } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };
    if (!onJoin) {
      onJoin = () => {
      };
    }
    if (!onLeave) {
      onLeave = () => {
      };
    }
    this.map(joins, (key, newPresences) => {
      var _a;
      const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
      state[key] = this.cloneDeep(newPresences);
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
        const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
        state[key].unshift(...curPresences);
      }
      onJoin(key, currentPresences, newPresences);
    });
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key];
      if (!currentPresences)
        return;
      const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
      currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
      state[key] = currentPresences;
      onLeave(key, currentPresences, leftPresences);
      if (currentPresences.length === 0)
        delete state[key];
    });
    return state;
  }
  /** @internal */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key];
      if ("metas" in presences) {
        newState[key] = presences.metas.map((presence) => {
          presence["presence_ref"] = presence["phx_ref"];
          delete presence["phx_ref"];
          delete presence["phx_ref_prev"];
          return presence;
        });
      } else {
        newState[key] = presences;
      }
      return newState;
    }, {});
  }
  /** @internal */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /** @internal */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /** @internal */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /** @internal */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function(REALTIME_LISTEN_TYPES2) {
  REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
  REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
  REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
})(REALTIME_LISTEN_TYPES || (REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function(REALTIME_SUBSCRIBE_STATES2) {
  REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (REALTIME_SUBSCRIBE_STATES = {}));
var RealtimeChannel = class {
  constructor(topic, params = { config: {} }, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.state = CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.subTopic = topic.replace(/^realtime:/i, "");
    this.params.config = Object.assign({
      broadcast: { ack: false, self: false },
      presence: { key: "", enabled: false },
      private: false
    }, params.config);
    this.timeout = this.socket.timeout;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new Timer(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach((pushEvent) => pushEvent.send());
      this.pushBuffer = [];
    });
    this._onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket._remove(this);
    });
    this._onError((reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log("channel", `error ${this.topic}`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("timeout", () => {
      if (!this._isJoining()) {
        return;
      }
      this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive("error", (reason) => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log("channel", `error ${this.topic}`, reason);
      this.state = CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this._on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload);
    });
    this.presence = new RealtimePresence(this);
    this.broadcastEndpointURL = httpEndpointURL(this.socket.endPoint);
    this.private = this.params.config.private || false;
  }
  /** Subscribe registers your client with the server */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.state == CHANNEL_STATES.closed) {
      const { config: { broadcast, presence, private: isPrivate } } = this.params;
      const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [];
      const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0;
      const accessTokenPayload = {};
      const config = {
        broadcast,
        presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
        postgres_changes,
        private: isPrivate
      };
      if (this.socket.accessTokenValue) {
        accessTokenPayload.access_token = this.socket.accessTokenValue;
      }
      this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
      this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
      this.updateJoinPayload(Object.assign({ config }, accessTokenPayload));
      this.joinedOnce = true;
      this._rejoin(timeout);
      this.joinPush.receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
        var _a2;
        this.socket.setAuth();
        if (postgres_changes2 === void 0) {
          callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes;
          const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
          const newPostgresBindings = [];
          for (let i = 0; i < bindingsLen; i++) {
            const clientPostgresBinding = clientPostgresBindings[i];
            const { filter: { event, schema, table, filter } } = clientPostgresBinding;
            const serverPostgresFilter = postgres_changes2 && postgres_changes2[i];
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
            } else {
              this.unsubscribe();
              this.state = CHANNEL_STATES.errored;
              callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = newPostgresBindings;
          callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
          return;
        }
      }).receive("error", (error) => {
        this.state = CHANNEL_STATES.errored;
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
        return;
      }).receive("timeout", () => {
        callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
        return;
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(payload, opts = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload
    }, opts.timeout || this.timeout);
  }
  async untrack(opts = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, opts);
  }
  on(type, filter, callback) {
    if (this.state === CHANNEL_STATES.joined && type === REALTIME_LISTEN_TYPES.PRESENCE) {
      this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`);
      this.unsubscribe().then(() => this.subscribe());
    }
    return this._on(type, filter, callback);
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this._canPush() && args.type === "broadcast") {
      const { event, payload: endpoint_payload } = args;
      const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
      const options = {
        method: "POST",
        headers: {
          Authorization: authorization,
          apikey: this.socket.apiKey ? this.socket.apiKey : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              topic: this.subTopic,
              event,
              payload: endpoint_payload,
              private: this.private
            }
          ]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
        await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
        return response.ok ? "ok" : "error";
      } catch (error) {
        if (error.name === "AbortError") {
          return "timed out";
        } else {
          return "error";
        }
      }
    } else {
      return new Promise((resolve) => {
        var _a2, _b2, _c17;
        const push = this._push(args.type, args, opts.timeout || this.timeout);
        if (args.type === "broadcast" && !((_c17 = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c17 === void 0 ? void 0 : _c17.ack)) {
          resolve("ok");
        }
        push.receive("ok", () => resolve("ok"));
        push.receive("error", () => resolve("error"));
        push.receive("timeout", () => resolve("timed out"));
      });
    }
  }
  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(timeout = this.timeout) {
    this.state = CHANNEL_STATES.leaving;
    const onClose = () => {
      this.socket.log("channel", `leave ${this.topic}`);
      this._trigger(CHANNEL_EVENTS.close, "leave", this._joinRef());
    };
    this.joinPush.destroy();
    let leavePush = null;
    return new Promise((resolve) => {
      leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive("ok", () => {
        onClose();
        resolve("ok");
      }).receive("timeout", () => {
        onClose();
        resolve("timed out");
      }).receive("error", () => {
        resolve("error");
      });
      leavePush.send();
      if (!this._canPush()) {
        leavePush.trigger("ok", {});
      }
    }).finally(() => {
      leavePush === null || leavePush === void 0 ? void 0 : leavePush.destroy();
    });
  }
  /**
   * Teardown the channel.
   *
   * Destroys and stops related timers.
   */
  teardown() {
    this.pushBuffer.forEach((push) => push.destroy());
    this.pushBuffer = [];
    this.rejoinTimer.reset();
    this.joinPush.destroy();
    this.state = CHANNEL_STATES.closed;
    this.bindings = {};
  }
  /** @internal */
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }
    let pushEvent = new Push(this, event, payload, timeout);
    if (this._canPush()) {
      pushEvent.send();
    } else {
      this._addToPushBuffer(pushEvent);
    }
    return pushEvent;
  }
  /** @internal */
  _addToPushBuffer(pushEvent) {
    pushEvent.startTimeout();
    this.pushBuffer.push(pushEvent);
    if (this.pushBuffer.length > MAX_PUSH_BUFFER_SIZE) {
      const removedPush = this.pushBuffer.shift();
      if (removedPush) {
        removedPush.destroy();
        this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload);
      }
    }
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(_event, payload, _ref) {
    return payload;
  }
  /** @internal */
  _isMember(topic) {
    return this.topic === topic;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(type, payload, ref) {
    var _a, _b;
    const typeLower = type.toLocaleLowerCase();
    const { close, error, leave, join } = CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return;
    }
    let handledPayload = this._onMessage(typeLower, payload, ref);
    if (payload && !handledPayload) {
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    }
    if (["insert", "update", "delete"].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
        var _a2, _b2, _c17;
        return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c17 = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c17 === void 0 ? void 0 : _c17.toLocaleLowerCase()) === typeLower;
      }).map((bind) => bind.callback(handledPayload, ref));
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
        var _a2, _b2, _c17, _d, _e, _f;
        if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
          if ("id" in bind) {
            const bindId = bind.id;
            const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
            return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c17 = payload.data) === null || _c17 === void 0 ? void 0 : _c17.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
            return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
          }
        } else {
          return bind.type.toLocaleLowerCase() === typeLower;
        }
      }).map((bind) => {
        if (typeof handledPayload === "object" && "ids" in handledPayload) {
          const postgresChanges = handledPayload.data;
          const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
          const enrichedPayload = {
            schema,
            table,
            commit_timestamp,
            eventType: type2,
            new: {},
            old: {},
            errors
          };
          handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        bind.callback(handledPayload, ref);
      });
    }
  }
  /** @internal */
  _isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }
  /** @internal */
  _replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  /** @internal */
  _on(type, filter, callback) {
    const typeLower = type.toLocaleLowerCase();
    const binding = {
      type: typeLower,
      filter,
      callback
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    return this;
  }
  /** @internal */
  _off(type, filter) {
    const typeLower = type.toLocaleLowerCase();
    if (this.bindings[typeLower]) {
      this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
        var _a;
        return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && RealtimeChannel.isEqual(bind.filter, filter));
      });
    }
    return this;
  }
  /** @internal */
  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this._rejoin();
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this._on(CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this._on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(timeout = this.timeout) {
    if (this._isLeaving()) {
      return;
    }
    this.socket._leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === "INSERT" || payload.type === "UPDATE") {
      records.new = convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === "UPDATE" || payload.type === "DELETE") {
      records.old = convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
};

// node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
var noop2 = () => {
};
var CONNECTION_TIMEOUTS = {
  HEARTBEAT_INTERVAL: 25e3,
  RECONNECT_DELAY: 10,
  HEARTBEAT_TIMEOUT_FALLBACK: 100
};
var RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
var DEFAULT_RECONNECT_FALLBACK = 1e4;
var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
var RealtimeClient = class {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.logLevel Sets the log level for Realtime
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   * @param options.worker Use Web Worker to set a side flow. Defaults to false.
   * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
   */
  constructor(endPoint, options) {
    var _a;
    this.accessTokenValue = null;
    this.apiKey = null;
    this.channels = new Array();
    this.endPoint = "";
    this.httpEndpoint = "";
    this.headers = {};
    this.params = {};
    this.timeout = DEFAULT_TIMEOUT;
    this.transport = null;
    this.heartbeatIntervalMs = CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
    this.heartbeatTimer = void 0;
    this.pendingHeartbeatRef = null;
    this.heartbeatCallback = noop2;
    this.ref = 0;
    this.reconnectTimer = null;
    this.logger = noop2;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new Serializer();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this.accessToken = null;
    this._connectionState = "disconnected";
    this._wasManualDisconnect = false;
    this._authPromise = null;
    this._resolveFetch = (customFetch) => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === "undefined") {
        _fetch = (...args) => import("/build/_shared/browser-7TFGYQUU.js").then(({ default: fetch2 }) => fetch2(...args)).catch((error) => {
          throw new Error(`Failed to load @supabase/node-fetch: ${error.message}. This is required for HTTP requests in Node.js environments without native fetch.`);
        });
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
      throw new Error("API key is required to connect to Realtime");
    }
    this.apiKey = options.params.apikey;
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.httpEndpoint = httpEndpointURL(endPoint);
    this._initializeOptions(options);
    this._setupReconnectionTimer();
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (this.isConnecting() || this.isDisconnecting() || this.conn !== null && this.isConnected()) {
      return;
    }
    this._setConnectionState("connecting");
    this._setAuthSafely("connect");
    if (!this.transport) {
      try {
        this.conn = websocket_factory_default.createWebSocket(this.endpointURL());
      } catch (error) {
        this._setConnectionState("disconnected");
        throw new Error(`WebSocket not available: ${error.message}`);
      }
    } else {
      this.conn = new this.transport(this.endpointURL());
    }
    this._setupConnectionHandlers();
  }
  /**
   * Returns the URL of the websocket.
   * @returns string The URL of the websocket.
   */
  endpointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(code, reason) {
    if (this.isDisconnecting()) {
      return;
    }
    this._setConnectionState("disconnecting", true);
    if (this.conn) {
      const fallbackTimer = setTimeout(() => {
        this._setConnectionState("disconnected");
      }, 100);
      this.conn.onclose = () => {
        clearTimeout(fallbackTimer);
        this._setConnectionState("disconnected");
      };
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
      } else {
        this.conn.close();
      }
      this._teardownConnection();
    } else {
      this._setConnectionState("disconnected");
    }
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (this.channels.length === 0) {
      this.disconnect();
    }
    return status;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
    this.channels = [];
    this.disconnect();
    return values_1;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return CONNECTION_STATE.Connecting;
      case SOCKET_STATES.open:
        return CONNECTION_STATE.Open;
      case SOCKET_STATES.closing:
        return CONNECTION_STATE.Closing;
      default:
        return CONNECTION_STATE.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === CONNECTION_STATE.Open;
  }
  /**
   * Returns `true` if the connection is currently connecting.
   */
  isConnecting() {
    return this._connectionState === "connecting";
  }
  /**
   * Returns `true` if the connection is currently disconnecting.
   */
  isDisconnecting() {
    return this._connectionState === "disconnecting";
  }
  channel(topic, params = { config: {} }) {
    const realtimeTopic = `realtime:${topic}`;
    const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
    if (!exists) {
      const chan = new RealtimeChannel(`realtime:${topic}`, params, this);
      this.channels.push(chan);
      return chan;
    } else {
      return exists;
    }
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(data) {
    const { topic, event, payload, ref } = data;
    const callback = () => {
      this.encode(data, (result) => {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };
    this.log("push", `${topic} ${event} (${ref})`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * If param is null it will use the `accessToken` callback function or the token set on the client.
   *
   * On callback used, it will set the value of the token internal to the client.
   *
   * @param token A JWT string to override the token set on the client.
   */
  async setAuth(token = null) {
    this._authPromise = this._performAuth(token);
    try {
      await this._authPromise;
    } finally {
      this._authPromise = null;
    }
  }
  /**
   * Sends a heartbeat message if the socket is connected.
   */
  async sendHeartbeat() {
    var _a;
    if (!this.isConnected()) {
      this.heartbeatCallback("disconnected");
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      this.heartbeatCallback("timeout");
      this._wasManualDisconnect = false;
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "heartbeat timeout");
      setTimeout(() => {
        var _a2;
        if (!this.isConnected()) {
          (_a2 = this.reconnectTimer) === null || _a2 === void 0 ? void 0 : _a2.scheduleTimeout();
        }
      }, CONNECTION_TIMEOUTS.HEARTBEAT_TIMEOUT_FALLBACK);
      return;
    }
    this.pendingHeartbeatRef = this._makeRef();
    this.push({
      topic: "phoenix",
      event: "heartbeat",
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.heartbeatCallback("sent");
    this._setAuthSafely("heartbeat");
  }
  onHeartbeat(callback) {
    this.heartbeatCallback = callback;
  }
  /**
   * Flushes send buffer
   */
  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((callback) => callback());
      this.sendBuffer = [];
    }
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(topic) {
    let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
    if (dupChannel) {
      this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter((c) => c.topic !== channel.topic);
  }
  /** @internal */
  _onConnMessage(rawMessage) {
    this.decode(rawMessage.data, (msg) => {
      if (msg.topic === "phoenix" && msg.event === "phx_reply") {
        this.heartbeatCallback(msg.payload.status === "ok" ? "ok" : "error");
      }
      if (msg.ref && msg.ref === this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
      }
      const { topic, event, payload, ref } = msg;
      const refString = ref ? `(${ref})` : "";
      const status = payload.status || "";
      this.log("receive", `${status} ${topic} ${event} ${refString}`.trim(), payload);
      this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
      this._triggerStateCallbacks("message", msg);
    });
  }
  /**
   * Clear specific timer
   * @internal
   */
  _clearTimer(timer) {
    var _a;
    if (timer === "heartbeat" && this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = void 0;
    } else if (timer === "reconnect") {
      (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.reset();
    }
  }
  /**
   * Clear all timers
   * @internal
   */
  _clearAllTimers() {
    this._clearTimer("heartbeat");
    this._clearTimer("reconnect");
  }
  /**
   * Setup connection handlers for WebSocket events
   * @internal
   */
  _setupConnectionHandlers() {
    if (!this.conn)
      return;
    if ("binaryType" in this.conn) {
      ;
      this.conn.binaryType = "arraybuffer";
    }
    this.conn.onopen = () => this._onConnOpen();
    this.conn.onerror = (error) => this._onConnError(error);
    this.conn.onmessage = (event) => this._onConnMessage(event);
    this.conn.onclose = (event) => this._onConnClose(event);
  }
  /**
   * Teardown connection and cleanup resources
   * @internal
   */
  _teardownConnection() {
    if (this.conn) {
      this.conn.onopen = null;
      this.conn.onerror = null;
      this.conn.onmessage = null;
      this.conn.onclose = null;
      this.conn = null;
    }
    this._clearAllTimers();
    this.channels.forEach((channel) => channel.teardown());
  }
  /** @internal */
  _onConnOpen() {
    this._setConnectionState("connected");
    this.log("transport", `connected to ${this.endpointURL()}`);
    this.flushSendBuffer();
    this._clearTimer("reconnect");
    if (!this.worker) {
      this._startHeartbeat();
    } else {
      if (!this.workerRef) {
        this._startWorkerHeartbeat();
      }
    }
    this._triggerStateCallbacks("open");
  }
  /** @internal */
  _startHeartbeat() {
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }
  /** @internal */
  _startWorkerHeartbeat() {
    if (this.workerUrl) {
      this.log("worker", `starting worker for from ${this.workerUrl}`);
    } else {
      this.log("worker", `starting default worker`);
    }
    const objectUrl = this._workerObjectUrl(this.workerUrl);
    this.workerRef = new Worker(objectUrl);
    this.workerRef.onerror = (error) => {
      this.log("worker", "worker error", error.message);
      this.workerRef.terminate();
    };
    this.workerRef.onmessage = (event) => {
      if (event.data.event === "keepAlive") {
        this.sendHeartbeat();
      }
    };
    this.workerRef.postMessage({
      event: "start",
      interval: this.heartbeatIntervalMs
    });
  }
  /** @internal */
  _onConnClose(event) {
    var _a;
    this._setConnectionState("disconnected");
    this.log("transport", "close", event);
    this._triggerChanError();
    this._clearTimer("heartbeat");
    if (!this._wasManualDisconnect) {
      (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.scheduleTimeout();
    }
    this._triggerStateCallbacks("close", event);
  }
  /** @internal */
  _onConnError(error) {
    this._setConnectionState("disconnected");
    this.log("transport", `${error}`);
    this._triggerChanError();
    this._triggerStateCallbacks("error", error);
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((channel) => channel._trigger(CHANNEL_EVENTS.error));
  }
  /** @internal */
  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    const prefix = url.match(/\?/) ? "&" : "?";
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }
  _workerObjectUrl(url) {
    let result_url;
    if (url) {
      result_url = url;
    } else {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      result_url = URL.createObjectURL(blob);
    }
    return result_url;
  }
  /**
   * Set connection state with proper state management
   * @internal
   */
  _setConnectionState(state, manual = false) {
    this._connectionState = state;
    if (state === "connecting") {
      this._wasManualDisconnect = false;
    } else if (state === "disconnecting") {
      this._wasManualDisconnect = manual;
    }
  }
  /**
   * Perform the actual auth operation
   * @internal
   */
  async _performAuth(token = null) {
    let tokenToSend;
    if (token) {
      tokenToSend = token;
    } else if (this.accessToken) {
      tokenToSend = await this.accessToken();
    } else {
      tokenToSend = this.accessTokenValue;
    }
    if (this.accessTokenValue != tokenToSend) {
      this.accessTokenValue = tokenToSend;
      this.channels.forEach((channel) => {
        const payload = {
          access_token: tokenToSend,
          version: DEFAULT_VERSION
        };
        tokenToSend && channel.updateJoinPayload(payload);
        if (channel.joinedOnce && channel._isJoined()) {
          channel._push(CHANNEL_EVENTS.access_token, {
            access_token: tokenToSend
          });
        }
      });
    }
  }
  /**
   * Wait for any in-flight auth operations to complete
   * @internal
   */
  async _waitForAuthIfNeeded() {
    if (this._authPromise) {
      await this._authPromise;
    }
  }
  /**
   * Safely call setAuth with standardized error handling
   * @internal
   */
  _setAuthSafely(context = "general") {
    this.setAuth().catch((e) => {
      this.log("error", `error setting auth in ${context}`, e);
    });
  }
  /**
   * Trigger state change callbacks with proper error handling
   * @internal
   */
  _triggerStateCallbacks(event, data) {
    try {
      this.stateChangeCallbacks[event].forEach((callback) => {
        try {
          callback(data);
        } catch (e) {
          this.log("error", `error in ${event} callback`, e);
        }
      });
    } catch (e) {
      this.log("error", `error triggering ${event} callbacks`, e);
    }
  }
  /**
   * Setup reconnection timer with proper configuration
   * @internal
   */
  _setupReconnectionTimer() {
    this.reconnectTimer = new Timer(async () => {
      setTimeout(async () => {
        await this._waitForAuthIfNeeded();
        if (!this.isConnected()) {
          this.connect();
        }
      }, CONNECTION_TIMEOUTS.RECONNECT_DELAY);
    }, this.reconnectAfterMs);
  }
  /**
   * Initialize client options with defaults
   * @internal
   */
  _initializeOptions(options) {
    var _a, _b, _c17, _d, _e, _f, _g, _h;
    this.transport = (_a = options === null || options === void 0 ? void 0 : options.transport) !== null && _a !== void 0 ? _a : null;
    this.timeout = (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT;
    this.heartbeatIntervalMs = (_c17 = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _c17 !== void 0 ? _c17 : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
    this.worker = (_d = options === null || options === void 0 ? void 0 : options.worker) !== null && _d !== void 0 ? _d : false;
    this.accessToken = (_e = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _e !== void 0 ? _e : null;
    if (options === null || options === void 0 ? void 0 : options.params)
      this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.logger)
      this.logger = options.logger;
    if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
      this.logLevel = options.logLevel || options.log_level;
      this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel });
    }
    this.reconnectAfterMs = (_f = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _f !== void 0 ? _f : (tries) => {
      return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
    };
    this.encode = (_g = options === null || options === void 0 ? void 0 : options.encode) !== null && _g !== void 0 ? _g : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (_h = options === null || options === void 0 ? void 0 : options.decode) !== null && _h !== void 0 ? _h : this.serializer.decode.bind(this.serializer);
    if (this.worker) {
      if (typeof window !== "undefined" && !window.Worker) {
        throw new Error("Web Worker is not supported");
      }
      this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
    }
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/errors.js
var StorageError = class extends Error {
  constructor(message) {
    super(message);
    this.__isStorageError = true;
    this.name = "StorageError";
  }
};
function isStorageError(error) {
  return typeof error === "object" && error !== null && "__isStorageError" in error;
}
var StorageApiError = class extends StorageError {
  constructor(message, status, statusCode) {
    super(message);
    this.name = "StorageApiError";
    this.status = status;
    this.statusCode = statusCode;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
};
var StorageUnknownError = class extends StorageError {
  constructor(message, originalError) {
    super(message);
    this.name = "StorageUnknownError";
    this.originalError = originalError;
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/helpers.js
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var resolveFetch2 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => import("/build/_shared/browser-7TFGYQUU.js").then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var resolveResponse = () => __awaiter2(void 0, void 0, void 0, function* () {
  if (typeof Response === "undefined") {
    return (yield import("/build/_shared/browser-7TFGYQUU.js")).Response;
  }
  return Response;
});
var recursiveToCamel = (item) => {
  if (Array.isArray(item)) {
    return item.map((el) => recursiveToCamel(el));
  } else if (typeof item === "function" || item !== Object(item)) {
    return item;
  }
  const result = {};
  Object.entries(item).forEach(([key, value]) => {
    const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
    result[newKey] = recursiveToCamel(value);
  });
  return result;
};
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};

// node_modules/@supabase/storage-js/dist/module/lib/fetch.js
var __awaiter3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
var handleError = (error, reject, options) => __awaiter3(void 0, void 0, void 0, function* () {
  const Res = yield resolveResponse();
  if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
    error.json().then((err) => {
      const status = error.status || 500;
      const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || status + "";
      reject(new StorageApiError(_getErrorMessage(err), status, statusCode));
    }).catch((err) => {
      reject(new StorageUnknownError(_getErrorMessage(err), err));
    });
  } else {
    reject(new StorageUnknownError(_getErrorMessage(error), error));
  }
});
var _getRequestParams = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET" || !body) {
    return params;
  }
  if (isPlainObject(body)) {
    params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
    params.body = JSON.stringify(body);
  } else {
    params.body = body;
  }
  return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(fetcher, method, url, options, parameters, body) {
  return __awaiter3(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
        if (!result.ok)
          throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson)
          return result;
        return result.json();
      }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
    });
  });
}
function get(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "GET", url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "POST", url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "PUT", url, options, parameters, body);
  });
}
function head(fetcher, url, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "HEAD", url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter3(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, "DELETE", url, options, parameters, body);
  });
}

// node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js
var __awaiter4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
};
var DEFAULT_FILE_OPTIONS = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: false
};
var StorageFileApi = class {
  constructor(url, headers = {}, bucketId, fetch2) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = resolveFetch2(fetch2);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        let headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
        const metadata = options.metadata;
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
          if (metadata) {
            body.append("metadata", this.encodeMetadata(metadata));
          }
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
          if (metadata) {
            headers["x-metadata"] = this.toBase64(this.encodeMetadata(metadata));
          }
        }
        if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
          headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
        }
        const cleanPath = this._removeEmptyFolders(path);
        const _path = this._getFinalPath(cleanPath);
        const data = yield (method == "PUT" ? put : post)(this.fetch, `${this.url}/object/${_path}`, body, Object.assign({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
        return {
          data: { path: cleanPath, id: data.Id, fullPath: data.Key },
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(path, token, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      const cleanPath = this._removeEmptyFolders(path);
      const _path = this._getFinalPath(cleanPath);
      const url = new URL(this.url + `/object/upload/sign/${_path}`);
      url.searchParams.set("token", token);
      try {
        let body;
        const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
        if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
          body = new FormData();
          body.append("cacheControl", options.cacheControl);
          body.append("", fileBody);
        } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
          body = fileBody;
          body.append("cacheControl", options.cacheControl);
        } else {
          body = fileBody;
          headers["cache-control"] = `max-age=${options.cacheControl}`;
          headers["content-type"] = options.contentType;
        }
        const data = yield put(this.fetch, url.toString(), body, { headers });
        return {
          data: { path: cleanPath, fullPath: data.Key },
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
   */
  createSignedUploadUrl(path, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        const headers = Object.assign({}, this.headers);
        if (options === null || options === void 0 ? void 0 : options.upsert) {
          headers["x-upsert"] = "true";
        }
        const data = yield post(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
        const url = new URL(this.url + data.url);
        const token = url.searchParams.get("token");
        if (!token) {
          throw new StorageError("No token returned by API");
        }
        return { data: { signedUrl: url.toString(), path, token }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(path, fileBody, fileOptions) {
    return __awaiter4(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   * @param options The destination options.
   */
  move(fromPath, toPath, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/move`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   * @param options The destination options.
   */
  copy(fromPath, toPath, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/copy`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath,
          destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
        }, { headers: this.headers });
        return { data: { path: data.Key }, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(path, expiresIn, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
        data = { signedUrl };
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(paths, expiresIn, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
        return {
          data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
          error: null
        };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(path, options) {
    return __awaiter4(this, void 0, void 0, function* () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
      const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : "";
      try {
        const _path = this._getFinalPath(path);
        const res = yield get(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing file.
   * @param path
   */
  info(path) {
    return __awaiter4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        const data = yield get(this.fetch, `${this.url}/object/info/${_path}`, {
          headers: this.headers
        });
        return { data: recursiveToCamel(data), error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Checks the existence of a file.
   * @param path
   */
  exists(path) {
    return __awaiter4(this, void 0, void 0, function* () {
      const _path = this._getFinalPath(path);
      try {
        yield head(this.fetch, `${this.url}/object/${_path}`, {
          headers: this.headers
        });
        return { data: true, error: null };
      } catch (error) {
        if (isStorageError(error) && error instanceof StorageUnknownError) {
          const originalError = error.originalError;
          if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
            return { data: false, error };
          }
        }
        throw error;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const _queryString = [];
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
    if (downloadQueryParam !== "") {
      _queryString.push(downloadQueryParam);
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
    const renderPath = wantsTransformation ? "render/image" : "object";
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
    if (transformationQuery !== "") {
      _queryString.push(transformationQuery);
    }
    let queryString = _queryString.join("&");
    if (queryString !== "") {
      queryString = `?${queryString}`;
    }
    return {
      data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(paths) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   * @param options Search options including limit (defaults to 100), offset, sortBy, and search
   */
  list(path, options, parameters) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
        const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  encodeMetadata(metadata) {
    return JSON.stringify(metadata);
  }
  toBase64(data) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data).toString("base64");
    }
    return btoa(data);
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path.replace(/^\/+/, "")}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(transform) {
    const params = [];
    if (transform.width) {
      params.push(`width=${transform.width}`);
    }
    if (transform.height) {
      params.push(`height=${transform.height}`);
    }
    if (transform.resize) {
      params.push(`resize=${transform.resize}`);
    }
    if (transform.format) {
      params.push(`format=${transform.format}`);
    }
    if (transform.quality) {
      params.push(`quality=${transform.quality}`);
    }
    return params.join("&");
  }
};

// node_modules/@supabase/storage-js/dist/module/lib/version.js
var version2 = "2.10.4";

// node_modules/@supabase/storage-js/dist/module/lib/constants.js
var DEFAULT_HEADERS = { "X-Client-Info": `storage-js/${version2}` };

// node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js
var __awaiter5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var StorageBucketApi = class {
  constructor(url, headers = {}, fetch2, opts) {
    const baseUrl = new URL(url);
    if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
      const isSupabaseHost = /supabase\.(co|in|red)$/.test(baseUrl.hostname);
      if (isSupabaseHost && !baseUrl.hostname.includes("storage.supabase.")) {
        baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
      }
    }
    this.url = baseUrl.href;
    this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), headers);
    this.fetch = resolveFetch2(fetch2);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
   *   - default bucket type is `STANDARD`
   */
  createBucket(id, options = {
    public: false
  }) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          type: options.type,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(id, options) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield put(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(id) {
    return __awaiter5(this, void 0, void 0, function* () {
      try {
        const data = yield remove(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
        return { data, error: null };
      } catch (error) {
        if (isStorageError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
};

// node_modules/@supabase/storage-js/dist/module/StorageClient.js
var StorageClient = class extends StorageBucketApi {
  constructor(url, headers = {}, fetch2, opts) {
    super(url, headers, fetch2, opts);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id) {
    return new StorageFileApi(this.url, this.headers, id, this.fetch);
  }
};

// node_modules/@supabase/supabase-js/dist/module/lib/version.js
var version3 = "2.54.0";

// node_modules/@supabase/supabase-js/dist/module/lib/constants.js
var JS_ENV = "";
if (typeof Deno !== "undefined") {
  JS_ENV = "deno";
} else if (typeof document !== "undefined") {
  JS_ENV = "web";
} else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  JS_ENV = "react-native";
} else {
  JS_ENV = "node";
}
var DEFAULT_HEADERS2 = { "X-Client-Info": `supabase-js-${JS_ENV}/${version3}` };
var DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS2
};
var DEFAULT_DB_OPTIONS = {
  schema: "public"
};
var DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: "implicit"
};
var DEFAULT_REALTIME_OPTIONS = {};

// node_modules/@supabase/supabase-js/dist/module/lib/fetch.js
init_browser();
var __awaiter6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var resolveFetch3 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = browser_default;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var resolveHeadersConstructor = () => {
  if (typeof Headers === "undefined") {
    return Headers2;
  }
  return Headers;
};
var fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch2 = resolveFetch3(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter6(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has("apikey")) {
      headers.set("apikey", supabaseKey);
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
  });
};

// node_modules/@supabase/supabase-js/dist/module/lib/helpers.js
var __awaiter7 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function ensureTrailingSlash(url) {
  return url.endsWith("/") ? url : url + "/";
}
function applySettingDefaults(options, defaults) {
  var _a, _b;
  const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
  const { db: DEFAULT_DB_OPTIONS2, auth: DEFAULT_AUTH_OPTIONS2, realtime: DEFAULT_REALTIME_OPTIONS2, global: DEFAULT_GLOBAL_OPTIONS2 } = defaults;
  const result = {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS2), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS2), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS2), realtimeOptions),
    storage: {},
    global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS2), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS2 === null || DEFAULT_GLOBAL_OPTIONS2 === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS2.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
    accessToken: () => __awaiter7(this, void 0, void 0, function* () {
      return "";
    })
  };
  if (options.accessToken) {
    result.accessToken = options.accessToken;
  } else {
    delete result.accessToken;
  }
  return result;
}

// node_modules/@supabase/auth-js/dist/module/lib/version.js
var version4 = "2.71.1";

// node_modules/@supabase/auth-js/dist/module/lib/constants.js
var AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
var AUTO_REFRESH_TICK_THRESHOLD = 3;
var EXPIRY_MARGIN_MS = AUTO_REFRESH_TICK_THRESHOLD * AUTO_REFRESH_TICK_DURATION_MS;
var GOTRUE_URL = "http://localhost:9999";
var STORAGE_KEY = "supabase.auth.token";
var DEFAULT_HEADERS3 = { "X-Client-Info": `gotrue-js/${version4}` };
var API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
var API_VERSIONS = {
  "2024-01-01": {
    timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
    name: "2024-01-01"
  }
};
var BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
var JWKS_TTL = 10 * 60 * 1e3;

// node_modules/@supabase/auth-js/dist/module/lib/errors.js
var AuthError = class extends Error {
  constructor(message, status, code) {
    super(message);
    this.__isAuthError = true;
    this.name = "AuthError";
    this.status = status;
    this.code = code;
  }
};
function isAuthError(error) {
  return typeof error === "object" && error !== null && "__isAuthError" in error;
}
var AuthApiError = class extends AuthError {
  constructor(message, status, code) {
    super(message, status, code);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
};
function isAuthApiError(error) {
  return isAuthError(error) && error.name === "AuthApiError";
}
var AuthUnknownError = class extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = "AuthUnknownError";
    this.originalError = originalError;
  }
};
var CustomAuthError = class extends AuthError {
  constructor(message, name, status, code) {
    super(message, status, code);
    this.name = name;
    this.status = status;
  }
};
var AuthSessionMissingError = class extends CustomAuthError {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
  }
};
function isAuthSessionMissingError(error) {
  return isAuthError(error) && error.name === "AuthSessionMissingError";
}
var AuthInvalidTokenResponseError = class extends CustomAuthError {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
  }
};
var AuthInvalidCredentialsError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidCredentialsError", 400, void 0);
  }
};
var AuthImplicitGrantRedirectError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthImplicitGrantRedirectError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
};
function isAuthImplicitGrantRedirectError(error) {
  return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
}
var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
  constructor(message, details = null) {
    super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
};
var AuthRetryableFetchError = class extends CustomAuthError {
  constructor(message, status) {
    super(message, "AuthRetryableFetchError", status, void 0);
  }
};
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === "AuthRetryableFetchError";
}
var AuthWeakPasswordError = class extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, "AuthWeakPasswordError", status, "weak_password");
    this.reasons = reasons;
  }
};
var AuthInvalidJwtError = class extends CustomAuthError {
  constructor(message) {
    super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/base64url.js
var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
var IGNORE_BASE64URL = " 	\n\r=".split("");
var FROM_BASE64URL = (() => {
  const charMap = new Array(128);
  for (let i = 0; i < charMap.length; i += 1) {
    charMap[i] = -1;
  }
  for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
    charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
  }
  for (let i = 0; i < TO_BASE64URL.length; i += 1) {
    charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
  }
  return charMap;
})();
function byteToBase64URL(byte, state, emit) {
  if (byte !== null) {
    state.queue = state.queue << 8 | byte;
    state.queuedBits += 8;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  } else if (state.queuedBits > 0) {
    state.queue = state.queue << 6 - state.queuedBits;
    state.queuedBits = 6;
    while (state.queuedBits >= 6) {
      const pos = state.queue >> state.queuedBits - 6 & 63;
      emit(TO_BASE64URL[pos]);
      state.queuedBits -= 6;
    }
  }
}
function byteFromBase64URL(charCode, state, emit) {
  const bits = FROM_BASE64URL[charCode];
  if (bits > -1) {
    state.queue = state.queue << 6 | bits;
    state.queuedBits += 6;
    while (state.queuedBits >= 8) {
      emit(state.queue >> state.queuedBits - 8 & 255);
      state.queuedBits -= 8;
    }
  } else if (bits === -2) {
    return;
  } else {
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
  }
}
function stringFromBase64URL(str) {
  const conv = [];
  const utf8Emit = (codepoint) => {
    conv.push(String.fromCodePoint(codepoint));
  };
  const utf8State = {
    utf8seq: 0,
    codepoint: 0
  };
  const b64State = { queue: 0, queuedBits: 0 };
  const byteEmit = (byte) => {
    stringFromUTF8(byte, utf8State, utf8Emit);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
  }
  return conv.join("");
}
function codepointToUTF8(codepoint, emit) {
  if (codepoint <= 127) {
    emit(codepoint);
    return;
  } else if (codepoint <= 2047) {
    emit(192 | codepoint >> 6);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 65535) {
    emit(224 | codepoint >> 12);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  } else if (codepoint <= 1114111) {
    emit(240 | codepoint >> 18);
    emit(128 | codepoint >> 12 & 63);
    emit(128 | codepoint >> 6 & 63);
    emit(128 | codepoint & 63);
    return;
  }
  throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
}
function stringToUTF8(str, emit) {
  for (let i = 0; i < str.length; i += 1) {
    let codepoint = str.charCodeAt(i);
    if (codepoint > 55295 && codepoint <= 56319) {
      const highSurrogate = (codepoint - 55296) * 1024 & 65535;
      const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
      codepoint = (lowSurrogate | highSurrogate) + 65536;
      i += 1;
    }
    codepointToUTF8(codepoint, emit);
  }
}
function stringFromUTF8(byte, state, emit) {
  if (state.utf8seq === 0) {
    if (byte <= 127) {
      emit(byte);
      return;
    }
    for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
      if ((byte >> 7 - leadingBit & 1) === 0) {
        state.utf8seq = leadingBit;
        break;
      }
    }
    if (state.utf8seq === 2) {
      state.codepoint = byte & 31;
    } else if (state.utf8seq === 3) {
      state.codepoint = byte & 15;
    } else if (state.utf8seq === 4) {
      state.codepoint = byte & 7;
    } else {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.utf8seq -= 1;
  } else if (state.utf8seq > 0) {
    if (byte <= 127) {
      throw new Error("Invalid UTF-8 sequence");
    }
    state.codepoint = state.codepoint << 6 | byte & 63;
    state.utf8seq -= 1;
    if (state.utf8seq === 0) {
      emit(state.codepoint);
    }
  }
}
function base64UrlToUint8Array(str) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onByte = (byte) => {
    result.push(byte);
  };
  for (let i = 0; i < str.length; i += 1) {
    byteFromBase64URL(str.charCodeAt(i), state, onByte);
  }
  return new Uint8Array(result);
}
function stringToUint8Array(str) {
  const result = [];
  stringToUTF8(str, (byte) => result.push(byte));
  return new Uint8Array(result);
}
function bytesToBase64URL(bytes) {
  const result = [];
  const state = { queue: 0, queuedBits: 0 };
  const onChar = (char) => {
    result.push(char);
  };
  bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
  byteToBase64URL(null, state, onChar);
  return result.join("");
}

// node_modules/@supabase/auth-js/dist/module/lib/helpers.js
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1e3);
  return timeNow + expiresIn;
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
var localStorageWriteTests = {
  tested: false,
  writable: false
};
var supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== "object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === "#") {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e) {
    }
  }
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
var resolveFetch4 = (customFetch) => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === "undefined") {
    _fetch = (...args) => import("/build/_shared/browser-7TFGYQUU.js").then(({ default: fetch2 }) => fetch2(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
var looksLikeFetchResponse = (maybeResponse) => {
  return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
};
var setItemAsync = async (storage, key, data) => {
  await storage.setItem(key, JSON.stringify(data));
};
var getItemAsync = async (storage, key) => {
  const value = await storage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
var removeItemAsync = async (storage, key) => {
  await storage.removeItem(key);
};
var Deferred = class {
  constructor() {
    ;
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      ;
      this.resolve = res;
      this.reject = rej;
    });
  }
};
Deferred.promiseConstructor = Promise;
function decodeJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthInvalidJwtError("Invalid JWT structure");
  }
  for (let i = 0; i < parts.length; i++) {
    if (!BASE64URL_REGEX.test(parts[i])) {
      throw new AuthInvalidJwtError("JWT not in base64url format");
    }
  }
  const data = {
    // using base64url lib
    header: JSON.parse(stringFromBase64URL(parts[0])),
    payload: JSON.parse(stringFromBase64URL(parts[1])),
    signature: base64UrlToUint8Array(parts[2]),
    raw: {
      header: parts[0],
      payload: parts[1]
    }
  };
  return data;
}
async function sleep(time) {
  return await new Promise((accept) => {
    setTimeout(() => accept(null), time);
  });
}
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === "undefined") {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const charSetLen = charSet.length;
    let verifier = "";
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest("SHA-256", encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
  if (!hasCryptoSupport) {
    console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
    return verifier;
  }
  const hashed = await sha256(verifier);
  return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += "/PASSWORD_RECOVERY";
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
  return [codeChallenge, codeChallengeMethod];
}
var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (e) {
    return null;
  }
}
function validateExp(exp) {
  if (!exp) {
    throw new Error("Missing exp claim");
  }
  const timeNow = Math.floor(Date.now() / 1e3);
  if (exp <= timeNow) {
    throw new Error("JWT has expired");
  }
}
function getAlgorithm(alg) {
  switch (alg) {
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      };
    case "ES256":
      return {
        name: "ECDSA",
        namedCurve: "P-256",
        hash: { name: "SHA-256" }
      };
    default:
      throw new Error("Invalid alg claim");
  }
}
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function validateUUID(str) {
  if (!UUID_REGEX.test(str)) {
    throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
  }
}
function userNotAvailableProxy() {
  const proxyTarget = {};
  return new Proxy(proxyTarget, {
    get: (target, prop) => {
      if (prop === "__isUserNotAvailableProxy") {
        return true;
      }
      if (typeof prop === "symbol") {
        const sProp = prop.toString();
        if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
          return void 0;
        }
      }
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
    },
    set: (_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    },
    deleteProperty: (_target, prop) => {
      throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
    }
  });
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// node_modules/@supabase/auth-js/dist/module/lib/fetch.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var _getErrorMessage2 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
var NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError2(error) {
  var _a;
  if (!looksLikeFetchResponse(error)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    throw new AuthRetryableFetchError(_getErrorMessage2(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new AuthUnknownError(_getErrorMessage2(e), e);
  }
  let errorCode = void 0;
  const responseAPIVersion = parseResponseAPIVersion(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
    errorCode = data.code;
  } else if (typeof data === "object" && data && typeof data.error_code === "string") {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
      throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === "weak_password") {
    throw new AuthWeakPasswordError(_getErrorMessage2(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  } else if (errorCode === "session_not_found") {
    throw new AuthSessionMissingError();
  }
  throw new AuthApiError(_getErrorMessage2(data), error.status || 500, errorCode);
}
var _getRequestParams2 = (method, options, parameters, body) => {
  const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
  if (method === "GET") {
    return params;
  }
  params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[API_VERSION_HEADER_NAME]) {
    headers[API_VERSION_HEADER_NAME] = API_VERSIONS["2024-01-01"].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs["redirect_to"] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
  const data = await _handleRequest2(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
}
async function _handleRequest2(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams2(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    console.error(e);
    throw new AuthRetryableFetchError(_getErrorMessage2(e), 0);
  }
  if (!result.ok) {
    await handleError2(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError2(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = expiresAt(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { session, user }, error: null };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return { data: { user }, error: null };
}
function _ssoResponse(data) {
  return { data, error: null };
}
function _generateLinkResponse(data) {
  const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}

// node_modules/@supabase/auth-js/dist/module/lib/types.js
var SIGN_OUT_SCOPES = ["global", "local", "others"];

// node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var GoTrueAdminApi = class {
  constructor({ url = "", headers = {}, fetch: fetch2 }) {
    this.url = url;
    this.headers = headers;
    this.fetch = resolveFetch4(fetch2);
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(jwt, scope = SIGN_OUT_SCOPES[0]) {
    if (SIGN_OUT_SCOPES.indexOf(scope) < 0) {
      throw new Error(`@supabase/auth-js: Parameter scope must be one of ${SIGN_OUT_SCOPES.join(", ")}`);
    }
    try {
      await _request(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return { data: null, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/invite`, {
        body: { email, data: options.data },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(params) {
    try {
      const { options } = params, rest = __rest2(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ("newEmail" in rest) {
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body["newEmail"];
      }
      return await _request(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body,
        headers: this.headers,
        xform: _generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes) {
    try {
      return await _request(this.fetch, "POST", `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(params) {
    var _a, _b, _c17, _d, _e, _f, _g;
    try {
      const pagination = { nextPage: null, lastPage: 0, total: 0 };
      const response = await _request(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
          per_page: (_d = (_c17 = params === null || params === void 0 ? void 0 : params.perPage) === null || _c17 === void 0 ? void 0 : _c17.toString()) !== null && _d !== void 0 ? _d : ""
        },
        xform: _noResolveJsonResponse
      });
      if (response.error)
        throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach((link) => {
          const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
          const rel = JSON.parse(link.split(";")[1].split("=")[1]);
          pagination[`${rel}Page`] = page;
        });
        pagination.total = parseInt(total);
      }
      return { data: Object.assign(Object.assign({}, users), pagination), error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { users: [] }, error };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid, attributes) {
    validateUUID(uid);
    try {
      return await _request(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    validateUUID(id);
    try {
      return await _request(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _userResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    validateUUID(params.userId);
    try {
      const { data, error } = await _request(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: (factors) => {
          return { data: { factors }, error: null };
        }
      });
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    validateUUID(params.userId);
    validateUUID(params.id);
    try {
      const data = await _request(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return { data, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
};

// node_modules/@supabase/auth-js/dist/module/lib/local-storage.js
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
}

// node_modules/@supabase/auth-js/dist/module/lib/polyfills.js
function polyfillGlobalThis() {
  if (typeof globalThis === "object")
    return;
  try {
    Object.defineProperty(Object.prototype, "__magic__", {
      get: function() {
        return this;
      },
      configurable: true
    });
    __magic__.globalThis = __magic__;
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== "undefined") {
      self.globalThis = self;
    }
  }
}

// node_modules/@supabase/auth-js/dist/module/lib/locks.js
var internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && supportsLocalStorage() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
var LockAcquireTimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
};
var NavigatorLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
};
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
      }
    }, acquireTimeout);
  }
  return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: "exclusive",
    ifAvailable: true
  } : {
    mode: "exclusive",
    signal: abortController.signal
  }, async (lock) => {
    if (lock) {
      if (internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
          } catch (e) {
            console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
          }
        }
        console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
        return await fn();
      }
    }
  }));
}

// node_modules/@supabase/auth-js/dist/module/GoTrueClient.js
polyfillGlobalThis();
var DEFAULT_OPTIONS = {
  url: GOTRUE_URL,
  storageKey: STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: DEFAULT_HEADERS3,
  flowType: "implicit",
  debug: false,
  hasCustomAuthorizationHeader: false
};
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
var GLOBAL_JWKS = {};
var GoTrueClient = class {
  /**
   * Create a new client for use in the browser.
   */
  constructor(options) {
    var _a, _b;
    this.userStorage = null;
    this.memoryStorage = null;
    this.stateChangeEmitters = /* @__PURE__ */ new Map();
    this.autoRefreshTicker = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    this.initializePromise = null;
    this.detectSessionInUrl = true;
    this.hasCustomAuthorizationHeader = false;
    this.suppressGetSessionWarning = false;
    this.lockAcquired = false;
    this.pendingInLock = [];
    this.broadcastChannel = null;
    this.logger = console.log;
    this.instanceID = GoTrueClient.nextInstanceID;
    GoTrueClient.nextInstanceID += 1;
    if (this.instanceID > 0 && isBrowser()) {
      console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
    }
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === "function") {
      this.logger = settings.debug;
    }
    this.persistSession = settings.persistSession;
    this.storageKey = settings.storageKey;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.admin = new GoTrueAdminApi({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = resolveFetch4(settings.fetch);
    this.lock = settings.lock || lockNoOp;
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
    if (settings.lock) {
      this.lock = settings.lock;
    } else if (isBrowser() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
      this.lock = navigatorLock;
    } else {
      this.lock = lockNoOp;
    }
    if (!this.jwks) {
      this.jwks = { keys: [] };
      this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
    }
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if (supportsLocalStorage()) {
          this.storage = globalThis.localStorage;
        } else {
          this.memoryStorage = {};
          this.storage = memoryLocalStorageAdapter(this.memoryStorage);
        }
      }
      if (settings.userStorage) {
        this.userStorage = settings.userStorage;
      }
    } else {
      this.memoryStorage = {};
      this.storage = memoryLocalStorageAdapter(this.memoryStorage);
    }
    if (isBrowser() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
      }
      (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener("message", async (event) => {
        this._debug("received broadcast notification from other tab or client", event);
        await this._notifyAllSubscribers(event.data.event, event.data.session, false);
      });
    }
    this.initialize();
  }
  /**
   * The JWKS used for verifying asymmetric JWTs
   */
  get jwks() {
    var _a, _b;
    return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
  }
  set jwks(value) {
    GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
  }
  get jwks_cached_at() {
    var _a, _b;
    return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
  }
  set jwks_cached_at(value) {
    GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(`GoTrueClient@${this.instanceID} (${version4}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...args);
    }
    return this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();
    return await this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    var _a;
    try {
      const params = parseParametersFromURL(window.location.href);
      let callbackUrlType = "none";
      if (this._isImplicitGrantCallback(params)) {
        callbackUrlType = "implicit";
      } else if (await this._isPKCECallback(params)) {
        callbackUrlType = "pkce";
      }
      if (isBrowser() && this.detectSessionInUrl && callbackUrlType !== "none") {
        const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
        if (error) {
          this._debug("#_initialize()", "error detecting session from URL", error);
          if (isAuthImplicitGrantRedirectError(error)) {
            const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
            if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
              return { error };
            }
          }
          await this._removeSession();
          return { error };
        }
        const { session, redirectType } = data;
        this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === "recovery") {
            await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
        }, 0);
        return { error: null };
      }
      await this._recoverAndRefresh();
      return { error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { error };
      }
      return {
        error: new AuthUnknownError("Unexpected error during initialization", error)
      };
    } finally {
      await this._handleVisibilityChange();
      this._debug("#_initialize()", "end");
    }
  }
  /**
   * Creates a new anonymous user.
   *
   * @returns A session where the is_anonymous claim in the access token JWT set to true
   */
  async signInAnonymously(credentials) {
    var _a, _b, _c17;
    try {
      const res = await _request(this.fetch, "POST", `${this.url}/signup`, {
        headers: this.headers,
        body: {
          data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
          gotrue_meta_security: { captcha_token: (_c17 = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c17 === void 0 ? void 0 : _c17.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  async signUp(credentials) {
    var _a, _b, _c17;
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _sessionResponse
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c17 = options === null || options === void 0 ? void 0 : options.channel) !== null && _c17 !== void 0 ? _c17 : "sms",
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponse
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error || !data) {
        return { data: { user: null, session: null }, error };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  async signInWithPassword(credentials) {
    try {
      let res;
      if ("email" in credentials) {
        const { email, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else if ("phone" in credentials) {
        const { phone, password, options } = credentials;
        res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          xform: _sessionResponsePassword
        });
      } else {
        throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
      }
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return { data: { user: null, session: null }, error: new AuthInvalidTokenResponseError() };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return {
        data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
        error
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c17, _d;
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c17 = credentials.options) === null || _c17 === void 0 ? void 0 : _c17.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(authCode) {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._exchangeCodeForSession(authCode);
    });
  }
  /**
   * Signs in a user by verifying a message signed by the user's private key.
   * Only Solana supported at this time, using the Sign in with Solana standard.
   */
  async signInWithWeb3(credentials) {
    const { chain } = credentials;
    if (chain === "solana") {
      return await this.signInWithSolana(credentials);
    }
    throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
  }
  async signInWithSolana(credentials) {
    var _a, _b, _c17, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let message;
    let signature;
    if ("message" in credentials) {
      message = credentials.message;
      signature = credentials.signature;
    } else {
      const { chain, wallet, statement, options } = credentials;
      let resolvedWallet;
      if (!isBrowser()) {
        if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
          throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
        }
        resolvedWallet = wallet;
      } else if (typeof wallet === "object") {
        resolvedWallet = wallet;
      } else {
        const windowAny = window;
        if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
          resolvedWallet = windowAny.solana;
        } else {
          throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
        }
      }
      const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
      if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
        const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
          // non-overridable properties
          version: "1",
          domain: url.host,
          uri: url.href
        }), statement ? { statement } : null));
        let outputToProcess;
        if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
          outputToProcess = output[0];
        } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
          outputToProcess = output;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
        }
        if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
          message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
          signature = outputToProcess.signature;
        } else {
          throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
        }
      } else {
        if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
          throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
        }
        message = [
          `${url.host} wants you to sign in with your Solana account:`,
          resolvedWallet.publicKey.toBase58(),
          ...statement ? ["", statement, ""] : [""],
          "Version: 1",
          `URI: ${url.href}`,
          `Issued At: ${(_c17 = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c17 !== void 0 ? _c17 : (/* @__PURE__ */ new Date()).toISOString()}`,
          ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
          ...((_e = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _e === void 0 ? void 0 : _e.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
          ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
          ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
          ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
          ...((_k = (_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.resources) === null || _k === void 0 ? void 0 : _k.length) ? [
            "Resources",
            ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
          ] : []
        ].join("\n");
        const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
        if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
          throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
        }
        signature = maybeSignature;
      }
    }
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
        headers: this.headers,
        body: Object.assign({ chain: "solana", message, signature: bytesToBase64URL(signature) }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data: Object.assign({}, data), error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  async _exchangeCodeForSession(authCode) {
    const storageItem = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
    try {
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
        headers: this.headers,
        body: {
          auth_code: authCode,
          code_verifier: codeVerifier
        },
        xform: _sessionResponse
      });
      await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      if (error) {
        throw error;
      }
      if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null, redirectType: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(credentials) {
    try {
      const { options, provider, token, access_token, nonce } = credentials;
      const res = await _request(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
        },
        xform: _sessionResponse
      });
      const { data, error } = res;
      if (error) {
        return { data: { user: null, session: null }, error };
      } else if (!data || !data.session || !data.user) {
        return {
          data: { user: null, session: null },
          error: new AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers("SIGNED_IN", data.session);
      }
      return { data, error };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c17, _d, _e;
    try {
      if ("email" in credentials) {
        const { email, options } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      }
      if ("phone" in credentials) {
        const { phone, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c17 = options === null || options === void 0 ? void 0 : options.data) !== null && _c17 !== void 0 ? _c17 : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
            channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number.");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      let redirectTo = void 0;
      let captchaToken = void 0;
      if ("options" in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const { data, error } = await _request(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
        redirectTo,
        xform: _sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("An error occurred on token verification.");
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
      }
      return { data: { user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  async signInWithSSO(params) {
    var _a, _b, _c17;
    try {
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === "pkce") {
        ;
        [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      }
      return await _request(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c17 = params === null || params === void 0 ? void 0 : params.options) === null || _c17 === void 0 ? void 0 : _c17.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
        headers: this.headers,
        xform: _ssoResponse
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   */
  async reauthenticate() {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._reauthenticate();
    });
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async (result) => {
        const { data: { session }, error: sessionError } = result;
        if (sessionError)
          throw sessionError;
        if (!session)
          throw new AuthSessionMissingError();
        const { error } = await _request(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return { data: { user: null, session: null }, error };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(credentials) {
    try {
      const endpoint = `${this.url}/resend`;
      if ("email" in credentials) {
        const { email, type, options } = credentials;
        const { error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return { data: { user: null, session: null }, error };
      } else if ("phone" in credentials) {
        const { phone, type, options } = credentials;
        const { data, error } = await _request(this.fetch, "POST", endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
          }
        });
        return { data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id }, error };
      }
      throw new AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   *
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   *
   * **IMPORTANT:** This method loads values directly from the storage attached
   * to the client. If that storage is based on request cookies for example,
   * the values in it may not be authentic and therefore it's strongly advised
   * against using this method and its results in such circumstances. A warning
   * will be emitted if this is detected. Use {@link #getUser()} instead.
   */
  async getSession() {
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return this._useSession(async (result2) => {
        return result2;
      });
    });
    return result;
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug("#_acquireLock", "begin", acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (e) {
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
            }
          })());
          await result;
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug("#_acquireLock", "end");
    }
  }
  /**
   * Use instead of {@link #getSession} inside the library. It is
   * semantically usually what you want, as getting a session involves some
   * processing afterwards that requires only one client operating on the
   * session at once across multiple tabs or processes.
   */
  async _useSession(fn) {
    this._debug("#_useSession", "begin");
    try {
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug("#_useSession", "end");
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use {@link #_useSession}.
   */
  async __loadSession() {
    this._debug("#__loadSession()", "begin");
    if (!this.lockAcquired) {
      this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await getItemAsync(this.storage, this.storageKey);
      this._debug("#getSession()", "session from storage", maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug("#getSession()", "session from storage is not valid");
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return { data: { session: null }, error: null };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < EXPIRY_MARGIN_MS : false;
      this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
      if (!hasExpired) {
        if (this.userStorage) {
          const maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
          if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) {
            currentSession.user = maybeUser.user;
          } else {
            currentSession.user = userNotAvailableProxy();
          }
        }
        if (this.storage.isServer && currentSession.user) {
          let suppressWarning = this.suppressGetSessionWarning;
          const proxySession = new Proxy(currentSession, {
            get: (target, prop, receiver) => {
              if (!suppressWarning && prop === "user") {
                console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
                suppressWarning = true;
                this.suppressGetSessionWarning = true;
              }
              return Reflect.get(target, prop, receiver);
            }
          });
          currentSession = proxySession;
        }
        return { data: { session: currentSession }, error: null };
      }
      const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        return { data: { session: null }, error };
      }
      return { data: { session }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Gets the current user details if there is an existing session. This method
   * performs a network request to the Supabase Auth server, so the returned
   * value is authentic and can be used to base authorization rules on.
   *
   * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return await this._getUser();
    });
    return result;
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt,
          xform: _userResponse
        });
      }
      return await this._useSession(async (result) => {
        var _a, _b, _c17;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
          return { data: { user: null }, error: new AuthSessionMissingError() };
        }
        return await _request(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (_c17 = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c17 !== void 0 ? _c17 : void 0,
          xform: _userResponse
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        if (isAuthSessionMissingError(error)) {
          await this._removeSession();
          await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
        }
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._updateUser(attributes, options);
    });
  }
  async _updateUser(attributes, options = {}) {
    try {
      return await this._useSession(async (result) => {
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce" && attributes.email != null) {
          ;
          [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
        }
        const { data, error: userError } = await _request(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
          jwt: session.access_token,
          xform: _userResponse
        });
        if (userError)
          throw userError;
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers("USER_UPDATED", session);
        return { data: { user: session.user }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._setSession(currentSession);
    });
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1e3;
      let expiresAt2 = timeNow;
      let hasExpired = true;
      let session = null;
      const { payload } = decodeJWT(currentSession.access_token);
      if (payload.exp) {
        expiresAt2 = payload.exp;
        hasExpired = expiresAt2 <= timeNow;
      }
      if (hasExpired) {
        const { session: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!refreshedSession) {
          return { data: { user: null, session: null }, error: null };
        }
        session = refreshedSession;
      } else {
        const { data, error } = await this._getUser(currentSession.access_token);
        if (error) {
          throw error;
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: "bearer",
          expires_in: expiresAt2 - timeNow,
          expires_at: expiresAt2
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers("SIGNED_IN", session);
      }
      return { data: { user: session.user, session }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._refreshSession(currentSession);
    });
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        if (!currentSession) {
          const { data, error: error2 } = result;
          if (error2) {
            throw error2;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new AuthSessionMissingError();
        }
        const { session, error } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return { data: { user: null, session: null }, error };
        }
        if (!session) {
          return { data: { user: null, session: null }, error: null };
        }
        return { data: { user: session.user, session }, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { user: null, session: null }, error };
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(params, callbackUrlType) {
    try {
      if (!isBrowser())
        throw new AuthImplicitGrantRedirectError("No browser detected.");
      if (params.error || params.error_description || params.error_code) {
        throw new AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
          error: params.error || "unspecified_error",
          code: params.error_code || "unspecified_code"
        });
      }
      switch (callbackUrlType) {
        case "implicit":
          if (this.flowType === "pkce") {
            throw new AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
          }
          break;
        case "pkce":
          if (this.flowType === "implicit") {
            throw new AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
          }
          break;
        default:
      }
      if (callbackUrlType === "pkce") {
        this._debug("#_initialize()", "begin", "is PKCE flow", true);
        if (!params.code)
          throw new AuthPKCEGrantCodeExchangeError("No code detected.");
        const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
        if (error2)
          throw error2;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState(window.history.state, "", url.toString());
        return { data: { session: data2.session, redirectType: null }, error: null };
      }
      const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new AuthImplicitGrantRedirectError("No session defined in URL");
      }
      const timeNow = Math.round(Date.now() / 1e3);
      const expiresIn = parseInt(expires_in);
      let expiresAt2 = timeNow + expiresIn;
      if (expires_at) {
        expiresAt2 = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt2 - timeNow;
      if (actuallyExpiresIn * 1e3 <= AUTO_REFRESH_TICK_DURATION_MS) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt2 - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt2, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt2, timeNow);
      }
      const { data, error } = await this._getUser(access_token);
      if (error)
        throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt2,
        refresh_token,
        token_type,
        user: data.user
      };
      window.location.hash = "";
      this._debug("#_getSessionFromURL()", "clearing window.location.hash");
      return { data: { session, redirectType: params.type }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { session: null, redirectType: null }, error };
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantCallback(params) {
    return Boolean(params.access_token || params.error_description);
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCECallback(params) {
    const currentStorageContent = await getItemAsync(this.storage, `${this.storageKey}-code-verifier`);
    return !!(params.code && currentStorageContent);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(options = { scope: "global" }) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._signOut(options);
    });
  }
  async _signOut({ scope } = { scope: "global" }) {
    return await this._useSession(async (result) => {
      var _a;
      const { data, error: sessionError } = result;
      if (sessionError) {
        return { error: sessionError };
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const { error } = await this.admin.signOut(accessToken, scope);
        if (error) {
          if (!(isAuthApiError(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
            return { error };
          }
        }
      }
      if (scope !== "others") {
        await this._removeSession();
        await removeItemAsync(this.storage, `${this.storageKey}-code-verifier`);
      }
      return { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(callback) {
    const id = uuid();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug("#onAuthStateChange()", "registered callback with id", id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();
    return { data: { subscription } };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async (result) => {
      var _a, _b;
      try {
        const { data: { session }, error } = result;
        if (error)
          throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
        this._debug("INITIAL_SESSION", "callback id", id, "session", session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
        this._debug("INITIAL_SESSION", "callback id", id, "error", err);
        console.error(err);
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    if (this.flowType === "pkce") {
      ;
      [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(
        this.storage,
        this.storageKey,
        true
        // isPasswordRecovery
      );
    }
    try {
      return await _request(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: { captcha_token: options.captchaToken }
        },
        headers: this.headers,
        redirectTo: options.redirectTo
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var _a;
    try {
      const { data, error } = await this.getUser();
      if (error)
        throw error;
      return { data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(credentials) {
    var _a;
    try {
      const { data, error } = await this._useSession(async (result) => {
        var _a2, _b, _c17, _d, _e;
        const { data: data2, error: error2 } = result;
        if (error2)
          throw error2;
        const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c17 = credentials.options) === null || _c17 === void 0 ? void 0 : _c17.queryParams,
          skipBrowserRedirect: true
        });
        return await _request(this.fetch, "GET", url, {
          headers: this.headers,
          jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
        });
      });
      if (error)
        throw error;
      if (isBrowser() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return { data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url }, error: null };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: { provider: credentials.provider, url: null }, error };
      }
      throw error;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data, error } = result;
        if (error) {
          throw error;
        }
        return await _request(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      const startedAt = Date.now();
      return await retryable(async (attempt) => {
        if (attempt > 0) {
          await sleep(200 * Math.pow(2, attempt - 1));
        }
        this._debug(debugName, "refreshing attempt", attempt);
        return await _request(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: refreshToken },
          headers: this.headers,
          xform: _sessionResponse
        });
      }, (attempt, error) => {
        const nextBackOffInterval = 200 * Math.pow(2, attempt);
        return error && isAuthRetryableFetchError(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION_MS;
      });
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        return { data: { session: null, user: null }, error };
      }
      throw error;
    } finally {
      this._debug(debugName, "end");
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
    if (isBrowser() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return { data: { provider, url }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes the token
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a, _b;
    const debugName = "#_recoverAndRefresh()";
    this._debug(debugName, "begin");
    try {
      const currentSession = await getItemAsync(this.storage, this.storageKey);
      if (currentSession && this.userStorage) {
        let maybeUser = await getItemAsync(this.userStorage, this.storageKey + "-user");
        if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
          maybeUser = { user: currentSession.user };
          await setItemAsync(this.userStorage, this.storageKey + "-user", maybeUser);
        }
        currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : userNotAvailableProxy();
      } else if (currentSession && !currentSession.user) {
        if (!currentSession.user) {
          const separateUser = await getItemAsync(this.storage, this.storageKey + "-user");
          if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
            currentSession.user = separateUser.user;
            await removeItemAsync(this.storage, this.storageKey + "-user");
            await setItemAsync(this.storage, this.storageKey, currentSession);
          } else {
            currentSession.user = userNotAvailableProxy();
          }
        }
      }
      this._debug(debugName, "session from storage", currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, "session is not valid");
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < EXPIRY_MARGIN_MS;
      this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${EXPIRY_MARGIN_MS}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const { error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            console.error(error);
            if (!isAuthRetryableFetchError(error)) {
              this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
              await this._removeSession();
            }
          }
        }
      } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
        try {
          const { data, error: userError } = await this._getUser(currentSession.access_token);
          if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
            currentSession.user = data.user;
            await this._saveSession(currentSession);
            await this._notifyAllSubscribers("SIGNED_IN", currentSession);
          } else {
            this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
          }
        } catch (getUserError) {
          console.error("Error getting user data:", getUserError);
          this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
        }
      } else {
        await this._notifyAllSubscribers("SIGNED_IN", currentSession);
      }
    } catch (err) {
      this._debug(debugName, "error", err);
      console.error(err);
      return;
    } finally {
      this._debug(debugName, "end");
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new AuthSessionMissingError();
    }
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, "begin");
    try {
      this.refreshingDeferred = new Deferred();
      const { data, error } = await this._refreshAccessToken(refreshToken);
      if (error)
        throw error;
      if (!data.session)
        throw new AuthSessionMissingError();
      await this._saveSession(data.session);
      await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
      const result = { session: data.session, error: null };
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, "error", error);
      if (isAuthError(error)) {
        const result = { session: null, error };
        if (!isAuthRetryableFetchError(error)) {
          await this._removeSession();
        }
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, "end");
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({ event, session });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
        try {
          await x.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i += 1) {
          console.error(errors[i]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug("#_saveSession()", session);
    this.suppressGetSessionWarning = true;
    const sessionToProcess = Object.assign({}, session);
    const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
    if (this.userStorage) {
      if (!userIsProxy && sessionToProcess.user) {
        await setItemAsync(this.userStorage, this.storageKey + "-user", {
          user: sessionToProcess.user
        });
      } else if (userIsProxy) {
      }
      const mainSessionData = Object.assign({}, sessionToProcess);
      delete mainSessionData.user;
      const clonedMainSessionData = deepClone(mainSessionData);
      await setItemAsync(this.storage, this.storageKey, clonedMainSessionData);
    } else {
      const clonedSession = deepClone(sessionToProcess);
      await setItemAsync(this.storage, this.storageKey, clonedSession);
    }
  }
  async _removeSession() {
    this._debug("#_removeSession()");
    await removeItemAsync(this.storage, this.storageKey);
    await removeItemAsync(this.storage, this.storageKey + "-code-verifier");
    await removeItemAsync(this.storage, this.storageKey + "-user");
    if (this.userStorage) {
      await removeItemAsync(this.userStorage, this.storageKey + "-user");
    }
    await this._notifyAllSubscribers("SIGNED_OUT", null);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && isBrowser() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener("visibilitychange", callback);
      }
    } catch (e) {
      console.error("removing visibilitychange callback failed", e);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug("#_startAutoRefresh()");
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION_MS);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
      ticker.unref();
    } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
      Deno.unrefTimer(ticker);
    }
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug("#_autoRefreshTokenTick()", "begin");
    try {
      await this._acquireLock(0, async () => {
        try {
          const now = Date.now();
          try {
            return await this._useSession(async (result) => {
              const { data: { session } } = result;
              if (!session || !session.refresh_token || !session.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / AUTO_REFRESH_TICK_DURATION_MS);
              this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (e) {
      if (e.isAcquireTimeout || e instanceof LockAcquireTimeoutError) {
        this._debug("auto refresh token tick lock not available");
      } else {
        throw e;
      }
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug("#_handleVisibilityChange()");
    if (!isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
      window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
      await this._onVisibilityChanged(true);
    } catch (error) {
      console.error("_handleVisibilityChange", error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, "visibilityState", document.visibilityState);
    if (document.visibilityState === "visible") {
      if (this.autoRefreshToken) {
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== "visible") {
            this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
            return;
          }
          await this._recoverAndRefresh();
        });
      }
    } else if (document.visibilityState === "hidden") {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (this.flowType === "pkce") {
      const [codeChallenge, codeChallengeMethod] = await getCodeChallengeAndMethod(this.storage, this.storageKey);
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(query.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return `${url}?${urlParams.join("&")}`;
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        return await _request(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  async _enroll(params) {
    try {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: sessionData, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : { issuer: params.issuer });
        const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors`, {
          body,
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return { data: null, error };
        }
        if (params.factorType === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return { data, error: null };
      });
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          const { data, error } = await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
            body: { code: params.code, challenge_id: params.challengeId },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return { data: null, error };
          }
          await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
          await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
          return { data, error };
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (result) => {
          var _a;
          const { data: sessionData, error: sessionError } = result;
          if (sessionError) {
            return { data: null, error: sessionError };
          }
          return await _request(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
            body: { channel: params.channel },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if (isAuthError(error)) {
          return { data: null, error };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    const { data: challengeData, error: challengeError } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return { data: null, error: challengeError };
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    const { data: { user }, error: userError } = await this.getUser();
    if (userError) {
      return { data: null, error: userError };
    }
    const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
    const totp = factors.filter((factor) => factor.factor_type === "totp" && factor.status === "verified");
    const phone = factors.filter((factor) => factor.factor_type === "phone" && factor.status === "verified");
    return {
      data: {
        all: factors,
        totp,
        phone
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => {
      return await this._useSession(async (result) => {
        var _a, _b;
        const { data: { session }, error: sessionError } = result;
        if (sessionError) {
          return { data: null, error: sessionError };
        }
        if (!session) {
          return {
            data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
            error: null
          };
        }
        const { payload } = decodeJWT(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = "aal2";
        }
        const currentAuthenticationMethods = payload.amr || [];
        return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
      });
    });
  }
  async fetchJwk(kid, jwks = { keys: [] }) {
    let jwk = jwks.keys.find((key) => key.kid === kid);
    if (jwk) {
      return jwk;
    }
    const now = Date.now();
    jwk = this.jwks.keys.find((key) => key.kid === kid);
    if (jwk && this.jwks_cached_at + JWKS_TTL > now) {
      return jwk;
    }
    const { data, error } = await _request(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
      headers: this.headers
    });
    if (error) {
      throw error;
    }
    if (!data.keys || data.keys.length === 0) {
      return null;
    }
    this.jwks = data;
    this.jwks_cached_at = now;
    jwk = data.keys.find((key) => key.kid === kid);
    if (!jwk) {
      return null;
    }
    return jwk;
  }
  /**
   * Extracts the JWT claims present in the access token by first verifying the
   * JWT against the server's JSON Web Key Set endpoint
   * `/.well-known/jwks.json` which is often cached, resulting in significantly
   * faster responses. Prefer this method over {@link #getUser} which always
   * sends a request to the Auth server for each JWT.
   *
   * If the project is not using an asymmetric JWT signing key (like ECC or
   * RSA) it always sends a request to the Auth server (similar to {@link
   * #getUser}) to verify the JWT.
   *
   * @param jwt An optional specific JWT you wish to verify, not the one you
   *            can obtain from {@link #getSession}.
   * @param options Various additional options that allow you to customize the
   *                behavior of this method.
   */
  async getClaims(jwt, options = {}) {
    try {
      let token = jwt;
      if (!token) {
        const { data, error } = await this.getSession();
        if (error || !data.session) {
          return { data: null, error };
        }
        token = data.session.access_token;
      }
      const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = decodeJWT(token);
      if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
        validateExp(payload.exp);
      }
      const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
      if (!signingKey) {
        const { error } = await this.getUser(token);
        if (error) {
          throw error;
        }
        return {
          data: {
            claims: payload,
            header,
            signature
          },
          error: null
        };
      }
      const algorithm = getAlgorithm(header.alg);
      const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
        "verify"
      ]);
      const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, stringToUint8Array(`${rawHeader}.${rawPayload}`));
      if (!isValid) {
        throw new AuthInvalidJwtError("Invalid JWT signature");
      }
      return {
        data: {
          claims: payload,
          header,
          signature
        },
        error: null
      };
    } catch (error) {
      if (isAuthError(error)) {
        return { data: null, error };
      }
      throw error;
    }
  }
};
GoTrueClient.nextInstanceID = 0;

// node_modules/@supabase/auth-js/dist/module/AuthClient.js
var AuthClient = GoTrueClient;
var AuthClient_default = AuthClient;

// node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js
var SupabaseAuthClient = class extends AuthClient_default {
  constructor(options) {
    super(options);
  }
};

// node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js
var __awaiter8 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var SupabaseClient = class {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.storage Options passed along to the storage-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c17;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl)
      throw new Error("supabaseUrl is required.");
    if (!supabaseKey)
      throw new Error("supabaseKey is required.");
    const _supabaseUrl = ensureTrailingSlash(supabaseUrl);
    const baseUrl = new URL(_supabaseUrl);
    this.realtimeUrl = new URL("realtime/v1", baseUrl);
    this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
    this.authUrl = new URL("auth/v1", baseUrl);
    this.storageUrl = new URL("storage/v1", baseUrl);
    this.functionsUrl = new URL("functions/v1", baseUrl);
    const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
    const DEFAULTS = {
      db: DEFAULT_DB_OPTIONS,
      realtime: DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
      global: DEFAULT_GLOBAL_OPTIONS
    };
    const settings = applySettingDefaults(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
    this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
    if (!settings.accessToken) {
      this.auth = this._initSupabaseAuthClient((_c17 = settings.auth) !== null && _c17 !== void 0 ? _c17 : {}, this.headers, settings.global.fetch);
    } else {
      this.accessToken = settings.accessToken;
      this.auth = new Proxy({}, {
        get: (_, prop) => {
          throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
        }
      });
    }
    this.fetch = fetchWithAuth(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
    this.rest = new PostgrestClient(new URL("rest/v1", baseUrl).href, {
      headers: this.headers,
      schema: settings.db.schema,
      fetch: this.fetch
    });
    this.storage = new StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
    if (!settings.accessToken) {
      this._listenForAuthEvents();
    }
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new FunctionsClient(this.functionsUrl.href, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = { config: {} }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter8(this, void 0, void 0, function* () {
      if (this.accessToken) {
        return yield this.accessToken();
      }
      const { data } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, storageKey, flowType, lock, debug }, headers, fetch2) {
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new SupabaseAuthClient({
      url: this.authUrl.href,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      lock,
      debug,
      fetch: fetch2,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: "Authorization" in this.headers
    });
  }
  _initRealtimeClient(options) {
    return new RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
      this.changedAccessToken = token;
    } else if (event === "SIGNED_OUT") {
      this.realtime.setAuth();
      if (source == "STORAGE")
        this.auth.signOut();
      this.changedAccessToken = void 0;
    }
  }
};

// node_modules/@supabase/supabase-js/dist/module/index.js
var createClient = (supabaseUrl, supabaseKey, options) => {
  return new SupabaseClient(supabaseUrl, supabaseKey, options);
};
function shouldShowDeprecationWarning() {
  if (typeof window !== "undefined") {
    return false;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const processVersion = process["version"];
  if (processVersion === void 0 || processVersion === null) {
    return false;
  }
  const versionMatch = processVersion.match(/^v(\d+)\./);
  if (!versionMatch) {
    return false;
  }
  const majorVersion = parseInt(versionMatch[1], 10);
  return majorVersion <= 18;
}
if (shouldShowDeprecationWarning()) {
  console.warn(`\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
}

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react2 = __toESM(require_react());

// node_modules/lucide-react/dist/esm/shared/src/utils.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var mergeClasses = (...classes) => classes.filter((className, index2, array) => {
  return Boolean(className) && array.indexOf(className) === index2;
}).join(" ");

// node_modules/lucide-react/dist/esm/Icon.js
var import_react = __toESM(require_react());

// node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// node_modules/lucide-react/dist/esm/Icon.js
var Icon = (0, import_react.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react2.forwardRef)(
    ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};

// node_modules/lucide-react/dist/esm/icons/bar-chart-3.js
var BarChart3 = createLucideIcon("BarChart3", [
  ["path", { d: "M3 3v18h18", key: "1s2lah" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);

// node_modules/lucide-react/dist/esm/icons/bomb.js
var Bomb = createLucideIcon("Bomb", [
  ["circle", { cx: "11", cy: "13", r: "9", key: "hd149" }],
  [
    "path",
    {
      d: "M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95",
      key: "jp4j1b"
    }
  ],
  ["path", { d: "m22 2-1.5 1.5", key: "ay92ug" }]
]);

// node_modules/lucide-react/dist/esm/icons/book.js
var Book = createLucideIcon("Book", [
  ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20", key: "t4utmx" }]
]);

// node_modules/lucide-react/dist/esm/icons/calendar.js
var Calendar = createLucideIcon("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);

// node_modules/lucide-react/dist/esm/icons/cat.js
var Cat = createLucideIcon("Cat", [
  [
    "path",
    {
      d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",
      key: "x6xyqk"
    }
  ],
  ["path", { d: "M8 14v.5", key: "1nzgdb" }],
  ["path", { d: "M16 14v.5", key: "1lajdz" }],
  ["path", { d: "M11.25 16.25h1.5L12 17l-.75-.75Z", key: "12kq1m" }]
]);

// node_modules/lucide-react/dist/esm/icons/check.js
var Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);

// node_modules/lucide-react/dist/esm/icons/chevron-left.js
var ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);

// node_modules/lucide-react/dist/esm/icons/chevron-right.js
var ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);

// node_modules/lucide-react/dist/esm/icons/circle-help.js
var CircleHelp = createLucideIcon("CircleHelp", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);

// node_modules/lucide-react/dist/esm/icons/clipboard-list.js
var ClipboardList = createLucideIcon("ClipboardList", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
]);

// node_modules/lucide-react/dist/esm/icons/crown.js
var Crown = createLucideIcon("Crown", [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
]);

// node_modules/lucide-react/dist/esm/icons/dice-6.js
var Dice6 = createLucideIcon("Dice6", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["path", { d: "M16 8h.01", key: "cr5u4v" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M16 16h.01", key: "1f9h7w" }],
  ["path", { d: "M8 8h.01", key: "1e4136" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
]);

// node_modules/lucide-react/dist/esm/icons/dices.js
var Dices = createLucideIcon("Dices", [
  ["rect", { width: "12", height: "12", x: "2", y: "10", rx: "2", ry: "2", key: "6agr2n" }],
  [
    "path",
    { d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6", key: "1o487t" }
  ],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "M10 14h.01", key: "ssrbsk" }],
  ["path", { d: "M15 6h.01", key: "cblpky" }],
  ["path", { d: "M18 9h.01", key: "2061c0" }]
]);

// node_modules/lucide-react/dist/esm/icons/frown.js
var Frown = createLucideIcon("Frown", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2", key: "epbg0q" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
]);

// node_modules/lucide-react/dist/esm/icons/gamepad-2.js
var Gamepad2 = createLucideIcon("Gamepad2", [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11", key: "1gktln" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13", key: "qnk9ow" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12", key: "krot7o" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10", key: "1lcuu1" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
      key: "mfqc10"
    }
  ]
]);

// node_modules/lucide-react/dist/esm/icons/history.js
var History = createLucideIcon("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);

// node_modules/lucide-react/dist/esm/icons/home.js
var Home = createLucideIcon("Home", [
  ["path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", key: "y5dka4" }],
  ["polyline", { points: "9 22 9 12 15 12 15 22", key: "e2us08" }]
]);

// node_modules/lucide-react/dist/esm/icons/menu.js
var Menu = createLucideIcon("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);

// node_modules/lucide-react/dist/esm/icons/moon.js
var Moon = createLucideIcon("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);

// node_modules/lucide-react/dist/esm/icons/party-popper.js
var PartyPopper = createLucideIcon("PartyPopper", [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79", key: "gwxi1d" }],
  ["path", { d: "M4 3h.01", key: "1vcuye" }],
  ["path", { d: "M22 8h.01", key: "1mrtc2" }],
  ["path", { d: "M15 2h.01", key: "1cjtqr" }],
  ["path", { d: "M22 20h.01", key: "1mrys2" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
      key: "hbicv8"
    }
  ],
  [
    "path",
    { d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17", key: "1i94pl" }
  ],
  ["path", { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7", key: "1cofks" }],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
      key: "4kbmks"
    }
  ]
]);

// node_modules/lucide-react/dist/esm/icons/pause.js
var Pause = createLucideIcon("Pause", [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
]);

// node_modules/lucide-react/dist/esm/icons/play.js
var Play = createLucideIcon("Play", [
  ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
]);

// node_modules/lucide-react/dist/esm/icons/plus.js
var Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);

// node_modules/lucide-react/dist/esm/icons/scroll-text.js
var ScrollText = createLucideIcon("ScrollText", [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
]);

// node_modules/lucide-react/dist/esm/icons/settings.js
var Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);

// node_modules/lucide-react/dist/esm/icons/shield.js
var Shield = createLucideIcon("Shield", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
]);

// node_modules/lucide-react/dist/esm/icons/smile.js
var Smile = createLucideIcon("Smile", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
]);

// node_modules/lucide-react/dist/esm/icons/sun.js
var Sun = createLucideIcon("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);

// node_modules/lucide-react/dist/esm/icons/swords.js
var Swords = createLucideIcon("Swords", [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5", key: "1hfsw2" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13", key: "1vrmhu" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20", key: "1bron3" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19", key: "13pww6" }],
  ["polyline", { points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5", key: "hbey2j" }],
  ["line", { x1: "5", x2: "9", y1: "14", y2: "18", key: "1hf58s" }],
  ["line", { x1: "7", x2: "4", y1: "17", y2: "20", key: "pidxm4" }],
  ["line", { x1: "3", x2: "5", y1: "19", y2: "21", key: "1pehsh" }]
]);

// node_modules/lucide-react/dist/esm/icons/target.js
var Target = createLucideIcon("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
]);

// node_modules/lucide-react/dist/esm/icons/trash-2.js
var Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);

// node_modules/lucide-react/dist/esm/icons/triangle-alert.js
var TriangleAlert = createLucideIcon("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);

// node_modules/lucide-react/dist/esm/icons/trophy.js
var Trophy = createLucideIcon("Trophy", [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
]);

// node_modules/lucide-react/dist/esm/icons/user-plus.js
var UserPlus = createLucideIcon("UserPlus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);

// node_modules/lucide-react/dist/esm/icons/users.js
var Users = createLucideIcon("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);

// node_modules/lucide-react/dist/esm/icons/volume-2.js
var Volume2 = createLucideIcon("Volume2", [
  ["polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "16drj5" }],
  ["path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07", key: "ltjumu" }],
  ["path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14", key: "1kegas" }]
]);

// node_modules/lucide-react/dist/esm/icons/volume-x.js
var VolumeX = createLucideIcon("VolumeX", [
  ["polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "16drj5" }],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
]);

// node_modules/lucide-react/dist/esm/icons/wind.js
var Wind = createLucideIcon("Wind", [
  ["path", { d: "M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2", key: "1k4u03" }],
  ["path", { d: "M9.6 4.6A2 2 0 1 1 11 8H2", key: "b7d0fd" }],
  ["path", { d: "M12.6 19.4A2 2 0 1 0 14 16H2", key: "1p5cb3" }]
]);

// node_modules/lucide-react/dist/esm/icons/x.js
var X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);

// app/constants/gameRules.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\constants\\gameRules.ts"
  );
  import.meta.hot.lastModified = "1754709840195.7183";
}
var GAME_RULES = {
  WIN_SCORE: 12,
  MAX_ROUNDS: 5,
  VP_MODES: [
    { name: "5\u5206\u5C40 (5/3/1)", scores: [5, 3, 1, 0, 0, 0] },
    { name: "5\u5206\u5C40 (5/4/3)", scores: [5, 4, 3, 0, 0, 0] },
    { name: "4\u5206\u5C40 (4/2/1)", scores: [4, 2, 1, 0, 0, 0] },
    { name: "4\u5206\u5C40 (4/3/2)", scores: [4, 3, 2, 0, 0, 0] },
    { name: "3\u5206\u5C40 (3/2/1)", scores: [3, 2, 1, 0, 0, 0] },
    { name: "3\u5206\u5C40 (3/1/0)", scores: [3, 1, 0, 0, 0, 0] }
  ],
  SPECIAL_RULES: [
    "\u65E0\u7279\u6B8A\u89C4\u5219",
    "\u624B\u724C\u660E\u724C",
    "\u7981\u6B62\u643A\u5E26 Skip",
    "\u732B\u724C\u89C6\u4E3A Skip",
    "\u81F3\u591A\u643A\u5E261\u5F20Skip",
    "\u81F3\u591A\u643A\u5E261\u5F20Defuse",
    "\u7981\u6B62\u643A\u5E26Attack",
    "\u81F3\u591A\u643A\u5E261\u5F20Attack",
    "1\u6B21\u514D\u8D39See the Future"
  ],
  AVATARS: [
    "\u{1F63C}",
    "\u{1F63B}",
    "\u{1F640}",
    "\u{1F63F}",
    "\u{1F63E}",
    "\u{1F638}",
    "\u{1F639}",
    "\u{1F63A}",
    "\u{1F63D}",
    "\u{1F431}",
    "\u{1F408}",
    "\u{1F408}\u200D\u2B1B",
    "\u{1F981}",
    "\u{1F405}",
    "\u{1F406}",
    "\u{1F42F}",
    "\u{1F648}",
    "\u{1F649}",
    "\u{1F64A}",
    "\u{1F435}",
    "\u{1F98A}",
    "\u{1F43A}",
    "\u{1F436}",
    "\u{1F415}",
    "\u{1F99D}",
    "\u{1F428}",
    "\u{1F43C}",
    "\u{1F439}",
    "\u{1F42D}",
    "\u{1F430}",
    "\u{1F43B}",
    "\u{1F43B}\u200D\u2744\uFE0F",
    "\u{1F438}",
    "\u{1F432}",
    "\u{1F984}",
    "\u{1F3AD}"
  ]
};

// app/constants/supabase.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\constants\\supabase.ts"
  );
  import.meta.hot.lastModified = "1754706045112.6787";
}
var SUPABASE_CONFIG = {
  url: "https://gatiuwpldvmxeeraldue.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE"
};

// app/utils/gameUtils.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\gameUtils.ts"
  );
  import.meta.hot.lastModified = "1754706045113.6787";
}
var UTILS = {
  getRandomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  calculatePlayerStats: (player) => {
    const history = player.history || [];
    const totalGames = history.length;
    const placements = history.reduce((acc, game) => {
      acc[game.placement] = (acc[game.placement] || 0) + 1;
      return acc;
    }, {});
    const averagePlacement = totalGames > 0 ? (history.reduce((sum, game) => sum + game.placement, 0) / totalGames).toFixed(1) : "N/A";
    const winRate = totalGames > 0 ? ((placements[1] || 0) / totalGames * 100).toFixed(1) : "0";
    return {
      totalGames,
      placements,
      averagePlacement,
      winRate,
      championships: player.championships || 0
    };
  }
};

// app/contexts/ThemeContext.tsx
var import_react3 = __toESM(require_react(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\contexts\\ThemeContext.tsx"
  );
  import.meta.hot.lastModified = "1754706045113.6787";
}
var ThemeContext = (0, import_react3.createContext)(void 0);
var useTheme = () => {
  const context = (0, import_react3.useContext)(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// app/components/layout/Sidebar.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\layout\\\\Sidebar.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\layout\\Sidebar.tsx"
  );
  import.meta.hot.lastModified = "1754712271714.862";
}
var Sidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted
}) => {
  _s();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const handleMusicToggle = () => {
    if (musicMuted) {
      setMusicMuted(false);
      setMusicPlaying(true);
    } else {
      if (musicPlaying) {
        setMusicMuted(true);
        setMusicPlaying(false);
      } else {
        setMusicPlaying(true);
      }
    }
  };
  const handleRulebookClick = () => {
    window.open("https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing", "_blank");
  };
  const menuItems = [{
    id: "home",
    name: "\u9996\u9875",
    icon: Home
  }, {
    id: "registration",
    name: "\u73A9\u5BB6\u6CE8\u518C",
    icon: UserPlus
  }, {
    id: "league",
    name: "\u8054\u8D5B\u7BA1\u7406",
    icon: Gamepad2
  }, {
    id: "rankings",
    name: "\u6392\u884C\u699C",
    icon: BarChart3
  }];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: () => setSidebarOpen(false) }, void 0, false, {
      fileName: "app/components/layout/Sidebar.tsx",
      lineNumber: 79,
      columnNumber: 29
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `fixed left-0 top-0 h-full ${theme === "dark" ? "bg-black/40" : "bg-white/80"} backdrop-blur-2xl border-r ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto ${sidebarCollapsed ? "w-16 lg:w-16" : "w-72 sm:w-80 md:w-72 lg:w-64"} ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-white/5 to-transparent" : "bg-gradient-to-b from-gray-50/50 to-transparent"}` }, void 0, false, {
        fileName: "app/components/layout/Sidebar.tsx",
        lineNumber: 83,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `relative p-4 sm:p-6 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200/50"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`, children: [
          !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cat, { className: "text-orange-400", size: 18 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 91,
              columnNumber: 41
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 90,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: `text-sm sm:text-base font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Boom League" }, void 0, false, {
                fileName: "app/components/layout/Sidebar.tsx",
                lineNumber: 94,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"} font-medium hidden sm:block`, children: "Tournament Tracker" }, void 0, false, {
                fileName: "app/components/layout/Sidebar.tsx",
                lineNumber: 95,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 93,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 89,
            columnNumber: 51
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSidebarCollapsed(!sidebarCollapsed), className: `hidden lg:flex w-8 h-8 items-center justify-center rounded-md transition-all duration-200 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`, title: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar", children: sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 103,
              columnNumber: 57
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronLeft, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 103,
              columnNumber: 92
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 102,
              columnNumber: 33
            }, this),
            !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSidebarOpen(false), className: `lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 108,
              columnNumber: 41
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 107,
              columnNumber: 55
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 100,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 87,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 86,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: `flex-1 ${sidebarCollapsed ? "p-2" : "p-3 sm:p-4"} relative z-10`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: `space-y-1 sm:space-y-1.5 ${sidebarCollapsed ? "flex flex-col items-center" : ""}`, children: menuItems.map((item) => {
          const Icon2 = item.icon;
          const isActive = currentPage === item.id;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => {
            setCurrentPage(item.id);
            setSidebarOpen(false);
          }, className: `group relative ${sidebarCollapsed ? "w-10 h-10" : "w-full"} flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden text-sm sm:text-base ${isActive ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : theme === "dark" ? "text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10" : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200"}`, title: sidebarCollapsed ? item.name : void 0, children: [
            isActive && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm" }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 125,
              columnNumber: 58
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Icon2, { size: 18, className: "relative z-10 flex-shrink-0" }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 126,
              columnNumber: 45
            }, this),
            !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium relative z-10 truncate", children: item.name }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 127,
              columnNumber: 67
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 121,
            columnNumber: 41
          }, this) }, item.id, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 120,
            columnNumber: 22
          }, this);
        }) }, void 0, false, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 116,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 115,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `relative p-3 sm:p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} mt-auto`, children: sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleMusicToggle, className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${musicPlaying && !musicMuted ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: musicMuted ? "Unmute music" : musicPlaying ? "Pause music" : "Play music", children: musicMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 139,
            columnNumber: 51
          }, this) : musicPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 139,
            columnNumber: 96
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 139,
            columnNumber: 124
          }, this) }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 138,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: toggleTheme, className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sun, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 143,
            columnNumber: 57
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Moon, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 143,
            columnNumber: 83
          }, this) }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 142,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleRulebookClick, className: `w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: "Open rulebook (external link)", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Book, { size: 14 }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 147,
            columnNumber: 37
          }, this) }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 146,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 136,
          columnNumber: 45
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleMusicToggle, className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${musicPlaying && !musicMuted ? "text-orange-400 bg-orange-500/20 border-orange-500/30" : theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: musicMuted ? "Unmute music" : musicPlaying ? "Pause music" : "Play music", children: musicMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 153,
              columnNumber: 55
            }, this) : musicPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 153,
              columnNumber: 100
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 153,
              columnNumber: 128
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 152,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: toggleTheme, className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sun, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 157,
              columnNumber: 61
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Moon, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 157,
              columnNumber: 87
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 156,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleRulebookClick, className: `p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, title: "Open rulebook (external link)", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Book, { size: 16 }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 161,
              columnNumber: 41
            }, this) }, void 0, false, {
              fileName: "app/components/layout/Sidebar.tsx",
              lineNumber: 160,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 150,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `text-xs ${theme === "dark" ? "text-white/40" : "text-gray-400"} font-medium`, children: "Controls" }, void 0, false, {
            fileName: "app/components/layout/Sidebar.tsx",
            lineNumber: 164,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 149,
          columnNumber: 38
        }, this) }, void 0, false, {
          fileName: "app/components/layout/Sidebar.tsx",
          lineNumber: 135,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/layout/Sidebar.tsx",
        lineNumber: 84,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/layout/Sidebar.tsx",
      lineNumber: 82,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/layout/Sidebar.tsx",
    lineNumber: 77,
    columnNumber: 10
  }, this);
};
_s(Sidebar, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
  return [useTheme];
});
_c = Sidebar;
var Sidebar_default = Sidebar;
var _c;
$RefreshReg$(_c, "Sidebar");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/Leaderboard.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\Leaderboard.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\Leaderboard.tsx"
  );
  import.meta.hot.lastModified = "1754706509412.1318";
}
var Leaderboard = ({
  players,
  onPlayerClick
}) => {
  _s2();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }, void 0, false, {
      fileName: "app/components/ui/Leaderboard.tsx",
      lineNumber: 34,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Trophy, { size: 14, className: "text-yellow-400 sm:w-4 sm:h-4" }, void 0, false, {
          fileName: "app/components/ui/Leaderboard.tsx",
          lineNumber: 38,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/ui/Leaderboard.tsx",
          lineNumber: 37,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Leaderboard" }, void 0, false, {
          fileName: "app/components/ui/Leaderboard.tsx",
          lineNumber: 40,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/Leaderboard.tsx",
        lineNumber: 36,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `group relative flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`, onClick: () => onPlayerClick && onPlayerClick(p), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm border flex-shrink-0 ${index2 === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : index2 === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` : index2 === 2 ? "bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"}`, children: index2 + 1 }, void 0, false, {
            fileName: "app/components/ui/Leaderboard.tsx",
            lineNumber: 45,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }, void 0, false, {
            fileName: "app/components/ui/Leaderboard.tsx",
            lineNumber: 48,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name }, void 0, false, {
            fileName: "app/components/ui/Leaderboard.tsx",
            lineNumber: 49,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/Leaderboard.tsx",
          lineNumber: 44,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "text-right flex-shrink-0", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "font-semibold text-base sm:text-lg text-emerald-400", children: p.score }, void 0, false, {
            fileName: "app/components/ui/Leaderboard.tsx",
            lineNumber: 52,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} font-medium`, children: "VP" }, void 0, false, {
            fileName: "app/components/ui/Leaderboard.tsx",
            lineNumber: 53,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/Leaderboard.tsx",
          lineNumber: 51,
          columnNumber: 29
        }, this)
      ] }, p.id, true, {
        fileName: "app/components/ui/Leaderboard.tsx",
        lineNumber: 43,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "app/components/ui/Leaderboard.tsx",
        lineNumber: 42,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/Leaderboard.tsx",
      lineNumber: 35,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/Leaderboard.tsx",
    lineNumber: 33,
    columnNumber: 10
  }, this);
};
_s2(Leaderboard, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c2 = Leaderboard;
var Leaderboard_default = Leaderboard;
var _c2;
$RefreshReg$(_c2, "Leaderboard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/InfoCard.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\InfoCard.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\InfoCard.tsx"
  );
  import.meta.hot.lastModified = "1754706509412.6533";
}
var InfoCard = ({
  icon,
  title,
  value
}) => {
  _s3();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg p-3 sm:p-4 lg:p-5 transition-all duration-200 ${theme === "dark" ? "hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]" : "hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]"}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg` }, void 0, false, {
      fileName: "app/components/ui/InfoCard.tsx",
      lineNumber: 34,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "relative z-10 flex items-center gap-2.5 sm:gap-3 lg:gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `p-2 sm:p-2.5 backdrop-blur-sm border rounded-lg flex-shrink-0 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center", children: icon }, void 0, false, {
        fileName: "app/components/ui/InfoCard.tsx",
        lineNumber: 37,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/ui/InfoCard.tsx",
        lineNumber: 36,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: `text-xs sm:text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"} truncate`, children: title }, void 0, false, {
          fileName: "app/components/ui/InfoCard.tsx",
          lineNumber: 42,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: `font-semibold text-base sm:text-lg lg:text-xl ${theme === "dark" ? "text-white" : "text-gray-900"} truncate`, children: value }, void 0, false, {
          fileName: "app/components/ui/InfoCard.tsx",
          lineNumber: 43,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/InfoCard.tsx",
        lineNumber: 41,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/InfoCard.tsx",
      lineNumber: 35,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/InfoCard.tsx",
    lineNumber: 33,
    columnNumber: 10
  }, this);
};
_s3(InfoCard, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c3 = InfoCard;
var InfoCard_default = InfoCard;
var _c3;
$RefreshReg$(_c3, "InfoCard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/ScheduleTimeline.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\ScheduleTimeline.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s4 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\ScheduleTimeline.tsx"
  );
  import.meta.hot.lastModified = "1754706045131.71";
}
var ScheduleTimeline = ({
  schedule,
  currentRound
}) => {
  _s4();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }, void 0, false, {
      fileName: "app/components/ui/ScheduleTimeline.tsx",
      lineNumber: 34,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "relative z-10 p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(ScrollText, { size: 16, className: "text-indigo-400" }, void 0, false, {
          fileName: "app/components/ui/ScheduleTimeline.tsx",
          lineNumber: 38,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/ui/ScheduleTimeline.tsx",
          lineNumber: 37,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: `text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Tournament Schedule" }, void 0, false, {
          fileName: "app/components/ui/ScheduleTimeline.tsx",
          lineNumber: 40,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/ScheduleTimeline.tsx",
        lineNumber: 36,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-2", children: schedule.map((roundInfo) => {
        const isActive = roundInfo.round === currentRound;
        return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: `relative p-4 rounded-lg transition-all duration-300 border ${isActive ? "bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-100/50 border-gray-200 hover:bg-gray-200/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: `font-semibold text-base ${isActive ? "text-orange-400" : theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              "Round ",
              roundInfo.round
            ] }, void 0, true, {
              fileName: "app/components/ui/ScheduleTimeline.tsx",
              lineNumber: 47,
              columnNumber: 37
            }, this),
            isActive && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]" }, void 0, false, {
              fileName: "app/components/ui/ScheduleTimeline.tsx",
              lineNumber: 50,
              columnNumber: 50
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/ScheduleTimeline.tsx",
            lineNumber: 46,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: `text-sm mt-1 font-medium ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
            roundInfo.vpMode.name,
            " \u2022 ",
            roundInfo.specialRule
          ] }, void 0, true, {
            fileName: "app/components/ui/ScheduleTimeline.tsx",
            lineNumber: 52,
            columnNumber: 33
          }, this)
        ] }, roundInfo.round, true, {
          fileName: "app/components/ui/ScheduleTimeline.tsx",
          lineNumber: 45,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/ui/ScheduleTimeline.tsx",
        lineNumber: 42,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/ScheduleTimeline.tsx",
      lineNumber: 35,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/ScheduleTimeline.tsx",
    lineNumber: 33,
    columnNumber: 10
  }, this);
};
_s4(ScheduleTimeline, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c4 = ScheduleTimeline;
var ScheduleTimeline_default = ScheduleTimeline;
var _c4;
$RefreshReg$(_c4, "ScheduleTimeline");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/Modal.tsx
var import_jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\Modal.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s5 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\Modal.tsx"
  );
  import.meta.hot.lastModified = "1754706509412.6533";
}
var Modal = ({
  children,
  onClose,
  title
}) => {
  _s5();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/40" : "bg-white/90"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_80px_rgba(0,0,0,0.5)]" : "shadow-[0_0_80px_rgba(0,0,0,0.2)]"} p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }, void 0, false, {
      fileName: "app/components/ui/Modal.tsx",
      lineNumber: 36,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "relative z-10", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "flex justify-between items-start gap-4 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("h3", { className: `text-lg sm:text-xl font-semibold tracking-tight flex-1 ${theme === "dark" ? "bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent" : "text-gray-900"}`, children: title }, void 0, false, {
          fileName: "app/components/ui/Modal.tsx",
          lineNumber: 39,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("button", { onClick: onClose, className: `p-2 rounded-lg transition-all duration-200 border border-transparent flex-shrink-0 active:scale-95 ${theme === "dark" ? "text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(X, { size: 18 }, void 0, false, {
          fileName: "app/components/ui/Modal.tsx",
          lineNumber: 43,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/components/ui/Modal.tsx",
          lineNumber: 42,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/Modal.tsx",
        lineNumber: 38,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "space-y-4 sm:space-y-6", children }, void 0, false, {
        fileName: "app/components/ui/Modal.tsx",
        lineNumber: 46,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/Modal.tsx",
      lineNumber: 37,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/Modal.tsx",
    lineNumber: 35,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/ui/Modal.tsx",
    lineNumber: 34,
    columnNumber: 10
  }, this);
};
_s5(Modal, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c5 = Modal;
var Modal_default = Modal;
var _c5;
$RefreshReg$(_c5, "Modal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/PlayerProfileModal.tsx
var import_jsx_dev_runtime6 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\PlayerProfileModal.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s6 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\PlayerProfileModal.tsx"
  );
  import.meta.hot.lastModified = "1754706045152.7368";
}
var PlayerProfileModal = ({
  player,
  onClose
}) => {
  _s6();
  const {
    theme
  } = useTheme();
  if (!player)
    return null;
  const stats = UTILS.calculatePlayerStats(player);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(Modal_default, { onClose, title: `${player.avatar} ${player.name} \u7684\u6863\u6848`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: "text-2xl font-bold text-yellow-400", children: player.championships || 0 }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 41,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F3C6} \u51A0\u519B\u6B21\u6570" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 42,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 40,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-2xl font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: player.runnerUp || 0 }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 45,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F948} \u4E9A\u519B\u6B21\u6570" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 46,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 44,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: "text-2xl font-bold text-orange-400", children: player.thirdPlace || 0 }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 49,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u{1F949} \u5B63\u519B\u6B21\u6570" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 50,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 48,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: "text-2xl font-bold text-emerald-400", children: player.score }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 53,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u5F53\u524D\u5206\u6570" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 54,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 52,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: "text-2xl font-bold text-blue-400", children: stats.totalGames }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 57,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u603B\u6E38\u620F\u6570" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 58,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 56,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border p-4 rounded-lg text-center`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: "text-2xl font-bold text-purple-400", children: stats.averagePlacement }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 61,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u5E73\u5747\u6392\u540D" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 62,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 60,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/PlayerProfileModal.tsx",
      lineNumber: 39,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`, children: "\u80DC\u7387" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 69,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: "text-orange-400 font-bold", children: [
          stats.winRate,
          "%"
        ] }, void 0, true, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 70,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 68,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"} rounded-full h-2`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "bg-orange-400 h-2 rounded-full transition-all duration-300", style: {
        width: `${stats.winRate}%`
      } }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 73,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 72,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/PlayerProfileModal.tsx",
      lineNumber: 67,
      columnNumber: 17
    }, this),
    stats.totalGames > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6392\u540D\u5206\u5E03" }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 81,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "space-y-2", children: [1, 2, 3, 4, 5, 6].map((place) => {
        const count = stats.placements[place] || 0;
        const percentage = stats.totalGames > 0 ? (count / stats.totalGames * 100).toFixed(1) : 0;
        return count > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `text-sm ${place === 1 ? "text-yellow-400" : place === 2 ? "text-gray-300" : place === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
            "\u7B2C",
            place,
            "\u540D"
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfileModal.tsx",
            lineNumber: 87,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} text-sm`, children: [
              count,
              "\u6B21"
            ] }, void 0, true, {
              fileName: "app/components/ui/PlayerProfileModal.tsx",
              lineNumber: 91,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`, children: [
              "(",
              percentage,
              "%)"
            ] }, void 0, true, {
              fileName: "app/components/ui/PlayerProfileModal.tsx",
              lineNumber: 92,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfileModal.tsx",
            lineNumber: 90,
            columnNumber: 41
          }, this)
        ] }, place, true, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 86,
          columnNumber: 32
        }, this) : null;
      }) }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 82,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/PlayerProfileModal.tsx",
      lineNumber: 80,
      columnNumber: 42
    }, this),
    player.history && player.history.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: `${theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"} p-4 rounded-lg`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("h4", { className: `${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold mb-3`, children: "\u6700\u8FD1\u6BD4\u8D5B" }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 101,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "space-y-2 max-h-32 overflow-y-auto", children: player.history.slice(-5).reverse().map((game, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("div", { className: "flex justify-between items-center text-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "\u7B2C",
          game.round,
          "\u8F6E"
        ] }, void 0, true, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 104,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { className: `font-semibold ${game.placement === 1 ? "text-yellow-400" : game.placement === 2 ? "text-gray-300" : game.placement === 3 ? "text-orange-400" : "text-gray-500"}`, children: [
          "\u7B2C",
          game.placement,
          "\u540D"
        ] }, void 0, true, {
          fileName: "app/components/ui/PlayerProfileModal.tsx",
          lineNumber: 105,
          columnNumber: 37
        }, this)
      ] }, index2, true, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 103,
        columnNumber: 86
      }, this)) }, void 0, false, {
        fileName: "app/components/ui/PlayerProfileModal.tsx",
        lineNumber: 102,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/PlayerProfileModal.tsx",
      lineNumber: 100,
      columnNumber: 65
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/PlayerProfileModal.tsx",
    lineNumber: 37,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/ui/PlayerProfileModal.tsx",
    lineNumber: 36,
    columnNumber: 10
  }, this);
};
_s6(PlayerProfileModal, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c6 = PlayerProfileModal;
var PlayerProfileModal_default = PlayerProfileModal;
var _c6;
$RefreshReg$(_c6, "PlayerProfileModal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/ResultsModal.tsx
var import_react4 = __toESM(require_react(), 1);
var import_jsx_dev_runtime7 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\ResultsModal.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s7 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\ResultsModal.tsx"
  );
  import.meta.hot.lastModified = "1754706509413.194";
}
var ResultsModal = ({
  players,
  onClose,
  onSubmit,
  round
}) => {
  _s7();
  const {
    theme
  } = useTheme();
  const [rankedPlayers, setRankedPlayers] = (0, import_react4.useState)(players.map((p) => p.id));
  const handleDragStart = (e, index2) => {
    e.dataTransfer.setData("draggedIndex", index2.toString());
  };
  const handleDrop = (e, dropIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    const newRankedPlayers = [...rankedPlayers];
    const [draggedItem] = newRankedPlayers.splice(draggedIndex, 1);
    newRankedPlayers.splice(dropIndex, 0, draggedItem);
    setRankedPlayers(newRankedPlayers);
  };
  const getPlayerById = (id) => players.find((p) => p.id === id);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(Modal_default, { onClose, title: `\u8F93\u5165\u7B2C ${round} \u8F6E\u6BD4\u8D5B\u7ED3\u679C`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("p", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4 text-sm sm:text-base`, children: "\u8BF7\u62D6\u52A8\u73A9\u5BB6\u5361\u7247\u4EE5\u786E\u5B9A\u672C\u8F6E\u540D\u6B21\uFF08\u4ECE\u4E0A\u5230\u4E0B\u4E3A 1-N \u540D\uFF09\u3002" }, void 0, false, {
      fileName: "app/components/ui/ResultsModal.tsx",
      lineNumber: 49,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { className: "space-y-2 sm:space-y-3 max-h-60 sm:max-h-72 overflow-y-auto", children: rankedPlayers.map((playerId, index2) => {
      const player = getPlayerById(playerId);
      if (!player)
        return null;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("div", { draggable: true, onDragStart: (e) => handleDragStart(e, index2), onDragOver: (e) => e.preventDefault(), onDrop: (e) => handleDrop(e, index2), className: `flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 active:scale-[0.98] ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 active:bg-gray-600" : "bg-gray-200 hover:bg-gray-300 active:bg-gray-300"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { className: "font-bold text-base sm:text-lg text-orange-400 w-5 sm:w-6 flex-shrink-0 text-center", children: index2 + 1 }, void 0, false, {
          fileName: "app/components/ui/ResultsModal.tsx",
          lineNumber: 57,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { className: "text-xl sm:text-2xl flex-shrink-0", children: player.avatar }, void 0, false, {
          fileName: "app/components/ui/ResultsModal.tsx",
          lineNumber: 58,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("span", { className: `font-semibold text-sm sm:text-base truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name }, void 0, false, {
          fileName: "app/components/ui/ResultsModal.tsx",
          lineNumber: 59,
          columnNumber: 33
        }, this)
      ] }, playerId, true, {
        fileName: "app/components/ui/ResultsModal.tsx",
        lineNumber: 56,
        columnNumber: 18
      }, this);
    }) }, void 0, false, {
      fileName: "app/components/ui/ResultsModal.tsx",
      lineNumber: 52,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)("button", { onClick: () => onSubmit(rankedPlayers), className: "w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm sm:text-base", children: "\u786E\u8BA4\u5E76\u8FDB\u5165\u4E0B\u4E00\u8F6E" }, void 0, false, {
      fileName: "app/components/ui/ResultsModal.tsx",
      lineNumber: 63,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/ResultsModal.tsx",
    lineNumber: 48,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/ui/ResultsModal.tsx",
    lineNumber: 47,
    columnNumber: 10
  }, this);
};
_s7(ResultsModal, "mBFSs84Q3NNIthijIT70cozQzuY=", false, function() {
  return [useTheme];
});
_c7 = ResultsModal;
var ResultsModal_default = ResultsModal;
var _c7;
$RefreshReg$(_c7, "ResultsModal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/SoundEffectsBox.tsx
var import_react5 = __toESM(require_react(), 1);
var import_jsx_dev_runtime8 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\SoundEffectsBox.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s8 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\SoundEffectsBox.tsx"
  );
  import.meta.hot.lastModified = "1754709509985.4045";
}
var SoundEffectsBox = () => {
  _s8();
  const {
    theme
  } = useTheme();
  const audioRefs = (0, import_react5.useRef)({});
  const youtubeRefs = (0, import_react5.useRef)({});
  const soundEffects = [{
    id: "fart",
    name: "\u{1F4A8} \u653E\u5C41",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Wind, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 37,
      columnNumber: 11
    }, this),
    color: "from-yellow-500/20 to-brown-500/20 border-yellow-500/30 text-yellow-400",
    youtubeId: "KJotmmDJWAg"
    // https://youtu.be/KJotmmDJWAg?si=4p66S6unYDf_r8Qm
  }, {
    id: "bomb",
    name: "\u{1F4A3} \u7206\u70B8",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Bomb, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 43,
      columnNumber: 11
    }, this),
    color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400",
    youtubeId: "HTXiJpCDiH4"
    // https://youtu.be/HTXiJpCDiH4?si=-4pK7MTGL1enE3S6
  }, {
    id: "laugh",
    name: "\u{1F602} \u5927\u7B11",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Smile, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 49,
      columnNumber: 11
    }, this),
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400",
    youtubeId: "Rc2k_8skxtI"
    // https://youtu.be/Rc2k_8skxtI?si=njTqQwahPfhmPMDu
  }, {
    id: "cry",
    name: "\u{1F62D} \u54ED\u6CE3",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Frown, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 55,
      columnNumber: 11
    }, this),
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    youtubeId: "pBUs2R9JV5M"
    // https://youtu.be/pBUs2R9JV5M?si=cfZJagAtlTVdsTmY
  }, {
    id: "happy",
    name: "\u{1F60A} \u5F00\u5FC3",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(PartyPopper, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 61,
      columnNumber: 11
    }, this),
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    youtubeId: "NSU2hJ5wT08"
    // https://youtu.be/NSU2hJ5wT08?si=o7wYMeINEKJ8WXCB
  }, {
    id: "huh",
    name: "\u{1F914} huh?",
    icon: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(CircleHelp, { size: 20 }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 67,
      columnNumber: 11
    }, this),
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
    youtubeId: "igO9SmiY4hs"
    // https://youtu.be/igO9SmiY4hs?si=-5l7Dm5X_t0ngqKf
  }];
  const playSound = (soundEffect) => {
    try {
      if (soundEffect.youtubeId) {
        playYouTubeSound(soundEffect.id, soundEffect.youtubeId);
        return;
      }
      playBeepSound();
    } catch (error) {
      console.log("Sound creation failed:", error);
      playBeepSound();
    }
  };
  const playYouTubeSound = (soundId, youtubeId) => {
    try {
      const iframe = youtubeRefs.current[soundId];
      if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = "";
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=0&volume=50&start=0&enablejsapi=1`;
      }
    } catch (error) {
      console.log("YouTube sound failed:", error);
      playBeepSound();
    }
  };
  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Web Audio API not supported");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "flex items-center gap-3 mb-4 sm:mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(Volume2, { className: theme === "dark" ? "text-white/70" : "text-gray-600", size: 20 }, void 0, false, {
        fileName: "app/components/ui/SoundEffectsBox.tsx",
        lineNumber: 122,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/ui/SoundEffectsBox.tsx",
        lineNumber: 121,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u97F3\u6548\u76D2" }, void 0, false, {
          fileName: "app/components/ui/SoundEffectsBox.tsx",
          lineNumber: 125,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("p", { className: `text-xs sm:text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u70B9\u51FB\u64AD\u653E\u97F3\u6548" }, void 0, false, {
          fileName: "app/components/ui/SoundEffectsBox.tsx",
          lineNumber: 128,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/SoundEffectsBox.tsx",
        lineNumber: 124,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 120,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3", children: soundEffects.map((sound) => /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("button", { onClick: () => playSound(sound), className: `p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-br ${sound.color} hover:shadow-lg active:shadow-sm group`, title: `\u64AD\u653E ${sound.name}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "transition-transform duration-200 group-hover:scale-110", children: sound.icon }, void 0, false, {
        fileName: "app/components/ui/SoundEffectsBox.tsx",
        lineNumber: 137,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("span", { className: "text-xs sm:text-sm font-medium text-center leading-tight", children: sound.name }, void 0, false, {
        fileName: "app/components/ui/SoundEffectsBox.tsx",
        lineNumber: 140,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 136,
      columnNumber: 25
    }, this) }, sound.id, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 135,
      columnNumber: 44
    }, this)) }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 134,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: `mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("p", { className: `text-xs text-center ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "\u{1F4A1} \u63D0\u793A\uFF1A\u5728\u6BD4\u8D5B\u4E2D\u4F7F\u7528\u97F3\u6548\u589E\u52A0\u4E50\u8DA3\uFF01" }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 148,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 147,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("div", { className: "hidden", children: soundEffects.filter((sound) => sound.youtubeId).map((sound) => /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)("iframe", { ref: (el) => youtubeRefs.current[sound.id] = el, width: "0", height: "0", src: `https://www.youtube.com/embed/${sound.youtubeId}?controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=1&enablejsapi=1`, title: `${sound.name} Sound Effect`, frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", style: {
      display: "none",
      position: "absolute",
      left: "-9999px",
      top: "-9999px"
    } }, sound.id, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 155,
      columnNumber: 77
    }, this)) }, void 0, false, {
      fileName: "app/components/ui/SoundEffectsBox.tsx",
      lineNumber: 154,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/SoundEffectsBox.tsx",
    lineNumber: 119,
    columnNumber: 10
  }, this);
};
_s8(SoundEffectsBox, "ezMpJJSmWK0TrTRO8Nal3eanhpI=", false, function() {
  return [useTheme];
});
_c8 = SoundEffectsBox;
var SoundEffectsBox_default = SoundEffectsBox;
var _c8;
$RefreshReg$(_c8, "SoundEffectsBox");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/ui/PlayerProfiles.tsx
var import_jsx_dev_runtime9 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\ui\\\\PlayerProfiles.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s9 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\ui\\PlayerProfiles.tsx"
  );
  import.meta.hot.lastModified = "1754706509412.6533";
}
var PlayerProfiles = ({
  players,
  onPlayerClick
}) => {
  _s9();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"} overflow-hidden`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"}` }, void 0, false, {
      fileName: "app/components/ui/PlayerProfiles.tsx",
      lineNumber: 34,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "relative z-10 p-4 sm:p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Users, { size: 14, className: "text-blue-400 sm:w-4 sm:h-4" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfiles.tsx",
          lineNumber: 38,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/ui/PlayerProfiles.tsx",
          lineNumber: 37,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("h3", { className: `text-base sm:text-lg font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"} tracking-tight`, children: "Player Profiles" }, void 0, false, {
          fileName: "app/components/ui/PlayerProfiles.tsx",
          lineNumber: 40,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/ui/PlayerProfiles.tsx",
        lineNumber: 36,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "space-y-1.5 sm:space-y-2", children: players.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${theme === "dark" ? "hover:bg-white/5 hover:border-white/10 active:bg-white/10" : "hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50"}`, onClick: () => onPlayerClick && onPlayerClick(p), children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "text-lg sm:text-xl flex-shrink-0", children: p.avatar }, void 0, false, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 45,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: `font-medium text-sm sm:text-base truncate ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: p.name }, void 0, false, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 46,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/PlayerProfiles.tsx",
          lineNumber: 44,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "flex flex-wrap gap-1.5 sm:gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs font-medium text-yellow-400", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { children: "\u{1F3C6}" }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 50,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "hidden xs:inline", children: [
              p.championships || 0,
              " \u51A0\u519B"
            ] }, void 0, true, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 51,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "xs:hidden", children: p.championships || 0 }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 52,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 49,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 bg-gray-400/10 border border-gray-400/20 rounded text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { children: "\u{1F948}" }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 55,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "hidden xs:inline", children: [
              p.runnerUp || 0,
              " \u4E9A\u519B"
            ] }, void 0, true, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 56,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "xs:hidden", children: p.runnerUp || 0 }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 57,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 54,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: "inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-xs font-medium text-orange-400", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { children: "\u{1F949}" }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 60,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "hidden xs:inline", children: [
              p.thirdPlace || 0,
              " \u5B63\u519B"
            ] }, void 0, true, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 61,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "xs:hidden", children: p.thirdPlace || 0 }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 62,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 59,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("div", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${theme === "dark" ? "bg-white/5 border-white/10 text-white/70" : "bg-gray-100/50 border-gray-200 text-gray-600"} border`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "hidden sm:inline", children: p.history.length > 0 ? `${p.history.length} Games` : "New Player" }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 65,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)("span", { className: "sm:hidden", children: p.history.length > 0 ? `${p.history.length}G` : "New" }, void 0, false, {
              fileName: "app/components/ui/PlayerProfiles.tsx",
              lineNumber: 66,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/ui/PlayerProfiles.tsx",
            lineNumber: 64,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/ui/PlayerProfiles.tsx",
          lineNumber: 48,
          columnNumber: 29
        }, this)
      ] }, p.id, true, {
        fileName: "app/components/ui/PlayerProfiles.tsx",
        lineNumber: 43,
        columnNumber: 39
      }, this)) }, void 0, false, {
        fileName: "app/components/ui/PlayerProfiles.tsx",
        lineNumber: 42,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/ui/PlayerProfiles.tsx",
      lineNumber: 35,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/ui/PlayerProfiles.tsx",
    lineNumber: 33,
    columnNumber: 10
  }, this);
};
_s9(PlayerProfiles, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c9 = PlayerProfiles;
var PlayerProfiles_default = PlayerProfiles;
var _c9;
$RefreshReg$(_c9, "PlayerProfiles");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/HomePage.tsx
var import_jsx_dev_runtime10 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\HomePage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s10 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\HomePage.tsx"
  );
  import.meta.hot.lastModified = "1754712067677.1523";
}
var HomePage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  handlePlayerClick,
  setCurrentPage
}) => {
  _s10();
  const {
    theme
  } = useTheme();
  if (!leagueState || leagueState.status === "setup") {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "space-y-6 sm:space-y-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "relative p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Cat, { className: "text-orange-400", size: 32 }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 45,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 44,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "text-center sm:text-left", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "Boom League" }, void 0, false, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 48,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "Professional Tournament Management" }, void 0, false, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 51,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 47,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 43,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 42,
        columnNumber: 17
      }, this),
      players.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "shadow-[0_0_50px_rgba(0,0,0,0.3)]" : "shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 57,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "relative z-10", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" }, void 0, false, {
              fileName: "app/components/pages/HomePage.tsx",
              lineNumber: 60,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("h2", { className: `text-xl sm:text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "Quick Start" }, void 0, false, {
              fileName: "app/components/pages/HomePage.tsx",
              lineNumber: 61,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 59,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-base sm:text-lg mb-6 sm:mb-8 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "text-orange-400 font-semibold", children: players.length }, void 0, false, {
              fileName: "app/components/pages/HomePage.tsx",
              lineNumber: 64,
              columnNumber: 33
            }, this),
            " players registered and ready to compete"
          ] }, void 0, true, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 63,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("button", { onClick: () => setCurrentPage("league"), disabled: players.length < 2, className: `relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 active:from-orange-500/40 active:to-orange-600/40 text-orange-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] active:scale-[0.98] text-sm sm:text-base ${players.length < 2 ? "disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100" : ""}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "relative z-10", children: "Start New Tournament" }, void 0, false, {
              fileName: "app/components/pages/HomePage.tsx",
              lineNumber: 67,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" }, void 0, false, {
              fileName: "app/components/pages/HomePage.tsx",
              lineNumber: 68,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 66,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 58,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 56,
        columnNumber: 40
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/HomePage.tsx",
      lineNumber: 41,
      columnNumber: 12
    }, this);
  }
  if (leagueState.status === "in_progress") {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("h2", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-2", children: leagueState.league_name || "\u8054\u8D5B\u8FDB\u884C\u4E2D" }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 77,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
          "\u7B2C ",
          leagueState.current_round,
          " / ",
          GAME_RULES.MAX_ROUNDS,
          " \u8F6E",
          leagueState.season_number && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("span", { className: "ml-2", children: [
            "\u2022 Season ",
            leagueState.season_number
          ] }, void 0, true, {
            fileName: "app/components/pages/HomePage.tsx",
            lineNumber: 82,
            columnNumber: 55
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 80,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 76,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 86,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(PlayerProfiles_default, { players, onPlayerClick: handlePlayerClick }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 87,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 85,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/HomePage.tsx",
      lineNumber: 75,
      columnNumber: 12
    }, this);
  }
  if (leagueState.status === "finished") {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(Crown, { className: "text-yellow-400", size: 60 }, void 0, false, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 94,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "\u8054\u8D5B\u7ED3\u675F\uFF01" }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 96,
          columnNumber: 25
        }, this),
        leagueState.season_number && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
          "Season ",
          leagueState.season_number,
          " \u5B8C\u6210"
        ] }, void 0, true, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 99,
          columnNumber: 55
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 95,
        columnNumber: 21
      }, this),
      leagueState.winner && /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)(import_jsx_dev_runtime10.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 104,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 105,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason }, void 0, false, {
          fileName: "app/components/pages/HomePage.tsx",
          lineNumber: 106,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 103,
        columnNumber: 44
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime10.jsxDEV)("button", { onClick: handleResetLeague, className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base", children: "\u5F00\u542F\u65B0\u8054\u8D5B" }, void 0, false, {
        fileName: "app/components/pages/HomePage.tsx",
        lineNumber: 108,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/HomePage.tsx",
      lineNumber: 93,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/pages/HomePage.tsx",
      lineNumber: 92,
      columnNumber: 12
    }, this);
  }
  return null;
};
_s10(HomePage, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c10 = HomePage;
var HomePage_default = HomePage;
var _c10;
$RefreshReg$(_c10, "HomePage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/PlayerRegistrationPage.tsx
var import_jsx_dev_runtime11 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\PlayerRegistrationPage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s11 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\PlayerRegistrationPage.tsx"
  );
  import.meta.hot.lastModified = "1754706045153.7373";
}
var PlayerRegistrationPage = ({
  players,
  handleAddPlayer,
  handleDeletePlayer,
  handlePlayerClick,
  newPlayerName,
  setNewPlayerName,
  selectedAvatar,
  setSelectedAvatar,
  showPlayerModal,
  setShowPlayerModal
}) => {
  _s11();
  const {
    theme
  } = useTheme();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("h2", { className: `text-4xl font-bold mb-3 ${theme === "dark" ? "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent" : "bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent"}`, children: "\u73A9\u5BB6\u6CE8\u518C" }, void 0, false, {
        fileName: "app/components/pages/PlayerRegistrationPage.tsx",
        lineNumber: 44,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("p", { className: `text-lg ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`, children: "\u7BA1\u7406\u53C2\u4E0E\u8054\u8D5B\u7684\u73A9\u5BB6" }, void 0, false, {
        fileName: "app/components/pages/PlayerRegistrationPage.tsx",
        lineNumber: 47,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/PlayerRegistrationPage.tsx",
      lineNumber: 43,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${theme === "dark" ? "bg-slate-800/40 border-slate-700/30" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("h3", { className: `text-2xl font-bold flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" }, void 0, false, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 53,
            columnNumber: 25
          }, this),
          "\u5DF2\u6CE8\u518C\u73A9\u5BB6",
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("span", { className: "text-orange-400", children: [
            "(",
            players.length,
            "/6)"
          ] }, void 0, true, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 55,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/PlayerRegistrationPage.tsx",
          lineNumber: 52,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("button", { onClick: () => setShowPlayerModal(true), disabled: players.length >= 6, className: "flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(Plus, { size: 18 }, void 0, false, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 58,
            columnNumber: 25
          }, this),
          " \u6DFB\u52A0\u73A9\u5BB6"
        ] }, void 0, true, {
          fileName: "app/components/pages/PlayerRegistrationPage.tsx",
          lineNumber: 57,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/PlayerRegistrationPage.tsx",
        lineNumber: 51,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: players.map((p) => {
        const stats = UTILS.calculatePlayerStats(p);
        return /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: `flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg ${theme === "dark" ? "bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/30" : "bg-white/50 hover:bg-gray-100/60 border-gray-200/30"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex items-center gap-4 flex-1", onClick: () => handlePlayerClick(p), children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "text-4xl", children: p.avatar }, void 0, false, {
              fileName: "app/components/pages/PlayerRegistrationPage.tsx",
              lineNumber: 67,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: p.name }, void 0, false, {
                fileName: "app/components/pages/PlayerRegistrationPage.tsx",
                lineNumber: 69,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                stats.championships > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("span", { className: "text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full", children: [
                  "\u{1F3C6} ",
                  stats.championships,
                  "\u51A0"
                ] }, void 0, true, {
                  fileName: "app/components/pages/PlayerRegistrationPage.tsx",
                  lineNumber: 71,
                  columnNumber: 73
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("span", { className: `text-xs px-2 py-1 rounded-full ${theme === "dark" ? "bg-slate-700/50 text-slate-300" : "bg-gray-200/50 text-gray-600"}`, children: stats.totalGames > 0 ? `${stats.totalGames}\u573A \u2022 ${stats.winRate}%\u80DC\u7387` : "\u65B0\u73A9\u5BB6" }, void 0, false, {
                  fileName: "app/components/pages/PlayerRegistrationPage.tsx",
                  lineNumber: 74,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/pages/PlayerRegistrationPage.tsx",
                lineNumber: 70,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/PlayerRegistrationPage.tsx",
              lineNumber: 68,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 66,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)("button", { onClick: (e) => {
            e.stopPropagation();
            handleDeletePlayer(p.id);
          }, className: "p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime11.jsxDEV)(Trash2, { size: 18 }, void 0, false, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 84,
            columnNumber: 37
          }, this) }, void 0, false, {
            fileName: "app/components/pages/PlayerRegistrationPage.tsx",
            lineNumber: 80,
            columnNumber: 33
          }, this)
        ] }, p.id, true, {
          fileName: "app/components/pages/PlayerRegistrationPage.tsx",
          lineNumber: 65,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/pages/PlayerRegistrationPage.tsx",
        lineNumber: 62,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/PlayerRegistrationPage.tsx",
      lineNumber: 50,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/pages/PlayerRegistrationPage.tsx",
    lineNumber: 42,
    columnNumber: 10
  }, this);
};
_s11(PlayerRegistrationPage, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c11 = PlayerRegistrationPage;
var PlayerRegistrationPage_default = PlayerRegistrationPage;
var _c11;
$RefreshReg$(_c11, "PlayerRegistrationPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/LeagueManagementPage.tsx
var import_react6 = __toESM(require_react(), 1);
var import_jsx_dev_runtime12 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\LeagueManagementPage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s12 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\LeagueManagementPage.tsx"
  );
  import.meta.hot.lastModified = "1754710168309.2795";
}
var LeagueManagementPage = ({
  leagueState,
  players,
  handleStartLeague,
  handleResetLeague,
  currentLeagueName,
  setCurrentLeagueName,
  nextSeasonNumber,
  leagueHistory,
  setCurrentPage
}) => {
  _s12();
  const {
    theme
  } = useTheme();
  const [selectedSpecialRules, setSelectedSpecialRules] = (0, import_react6.useState)(GAME_RULES.SPECIAL_RULES.slice());
  const [viewMode, setViewMode] = (0, import_react6.useState)("ongoing");
  const toggleSpecialRule = (rule) => {
    setSelectedSpecialRules((prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]);
  };
  const handleStartLeagueWithRules = () => {
    if (selectedSpecialRules.length === 0) {
      alert("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u79CD\u7279\u6B8A\u89C4\u5219\u53EF\u80FD\u6027\uFF01");
      return;
    }
    handleStartLeague(selectedSpecialRules);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return `${diffDays} \u5929`;
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u8054\u8D5B\u7BA1\u7406" }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 69,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u521B\u5EFA\u548C\u7BA1\u7406\u4F60\u7684 Boom League" }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 70,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueManagementPage.tsx",
      lineNumber: 68,
      columnNumber: 13
    }, this),
    (!leagueState || leagueState.status === "setup") && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h3", { className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u521B\u5EFA\u65B0\u8054\u8D5B" }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 75,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "\u8054\u8D5B\u540D\u79F0" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 79,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("input", { type: "text", value: currentLeagueName, onChange: (e) => setCurrentLeagueName(e.target.value), placeholder: `Boom League S${nextSeasonNumber}`, className: `w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-white/80 text-gray-900 border-gray-200"}` }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 82,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs mt-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "\u7559\u7A7A\u5C06\u4F7F\u7528\u9ED8\u8BA4\u540D\u79F0: Boom League S",
          nextSeasonNumber
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 83,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 78,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Settings, { className: "text-orange-400", size: 20 }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 91,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("label", { className: `text-sm font-medium ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "\u7279\u6B8A\u89C4\u5219\u53EF\u80FD\u6027\u9009\u62E9" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 92,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 90,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs mb-3 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u9009\u62E9\u8054\u8D5B\u4E2D\u53EF\u80FD\u51FA\u73B0\u7684\u7279\u6B8A\u89C4\u5219\u3002\u7CFB\u7EDF\u5C06\u4ECE\u9009\u4E2D\u7684\u89C4\u5219\u4E2D\u968F\u673A\u9009\u62E9\u3002" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 96,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: GAME_RULES.SPECIAL_RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: () => toggleSpecialRule(rule), className: `p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${selectedSpecialRules.includes(rule) ? theme === "dark" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-orange-100 border-orange-300 text-orange-700" : theme === "dark" ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { children: rule }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 103,
            columnNumber: 41
          }, this),
          selectedSpecialRules.includes(rule) && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Check, { size: 16, className: "text-orange-400" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 104,
            columnNumber: 81
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 102,
          columnNumber: 37
        }, this) }, rule, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 101,
          columnNumber: 67
        }, this)) }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 100,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `mt-2 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
          "\u5DF2\u9009\u62E9 ",
          selectedSpecialRules.length,
          " / ",
          GAME_RULES.SPECIAL_RULES.length,
          " \u79CD\u53EF\u80FD\u6027"
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 109,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 89,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: [
        "\u5F53\u524D\u6709 ",
        players.length,
        " \u540D\u73A9\u5BB6\u6CE8\u518C\u3002\u9700\u8981\u81F3\u5C11 2 \u540D\u73A9\u5BB6\u624D\u80FD\u5F00\u59CB\u8054\u8D5B\u3002"
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 114,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: handleStartLeagueWithRules, disabled: players.length < 2 || selectedSpecialRules.length === 0, className: "bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100", children: "\u5F00\u59CB\u8054\u8D5B" }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 117,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueManagementPage.tsx",
      lineNumber: 74,
      columnNumber: 66
    }, this),
    leagueState && leagueState.status !== "setup" && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u5F53\u524D\u8054\u8D5B\u72B6\u6001" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 125,
          columnNumber: 25
        }, this),
        leagueState.status === "in_progress" && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: () => setCurrentPage("in_progress"), className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Play, { size: 16 }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 127,
            columnNumber: 33
          }, this),
          "\u8FDB\u5165\u8054\u8D5B"
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 126,
          columnNumber: 66
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 124,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u8054\u8D5B\u540D\u79F0" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 134,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.league_name || "\u672A\u547D\u540D\u8054\u8D5B" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 135,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 133,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u72B6\u6001" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 140,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `font-bold text-lg ${leagueState.status === "in_progress" ? "text-green-400" : leagueState.status === "finished" ? "text-yellow-400" : leagueState.status === "pending_confirmation" ? "text-orange-400" : "text-gray-400"}`, children: leagueState.status === "in_progress" ? "\u8FDB\u884C\u4E2D" : leagueState.status === "finished" ? "\u5DF2\u7ED3\u675F" : leagueState.status === "pending_confirmation" ? "\u5F85\u786E\u8BA4" : "\u8BBE\u7F6E\u4E2D" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 141,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 139,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-4 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u5F53\u524D\u8F6E\u6B21" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 146,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.current_round,
            " / ",
            leagueState.schedule?.length || 5
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 147,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 145,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 132,
        columnNumber: 21
      }, this),
      leagueState.status === "finished" && leagueState.winner && /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `mt-4 p-4 rounded-lg border-2 border-yellow-400 ${theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Crown, { className: "text-yellow-400", size: 24 }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 155,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `font-bold ${theme === "dark" ? "text-yellow-400" : "text-yellow-700"}`, children: [
              "\u{1F3C6} ",
              leagueState.winner.name
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 157,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-600"}`, children: leagueState.winner.reason }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 160,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 156,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 154,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: handleResetLeague, className: "mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105", children: "\u5F00\u542F\u65B0\u8054\u8D5B" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 165,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 153,
        columnNumber: 81
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueManagementPage.tsx",
      lineNumber: 123,
      columnNumber: 63
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"} backdrop-blur-sm shadow-xl`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h3", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "\u8054\u8D5B\u8BB0\u5F55" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 174,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: () => setViewMode("ongoing"), className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "ongoing" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`, children: "\u6B63\u5728\u8FDB\u884C" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 176,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: () => setViewMode("history"), className: `px-4 py-2 text-sm font-medium transition-colors ${viewMode === "history" ? "bg-orange-500 text-white" : theme === "dark" ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`, children: "\u5386\u53F2\u8BB0\u5F55" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 179,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 175,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 173,
        columnNumber: 17
      }, this),
      viewMode === "ongoing" ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "space-y-4", children: leagueState && leagueState.status !== "setup" && leagueState.status !== "finished" ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.league_name || "\u5F53\u524D\u8054\u8D5B" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 189,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
            "\u7B2C ",
            leagueState.current_round,
            " \u8F6E / \u5171 ",
            leagueState.schedule?.length || 5,
            " \u8F6E"
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 192,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 188,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("span", { className: `px-2 py-1 text-xs rounded-full ${leagueState.status === "in_progress" ? "bg-green-500/20 text-green-400" : leagueState.status === "pending_confirmation" ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-400"}`, children: leagueState.status === "in_progress" ? "\u8FDB\u884C\u4E2D" : leagueState.status === "pending_confirmation" ? "\u5F85\u786E\u8BA4" : "\u672A\u77E5" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 197,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("button", { onClick: () => setCurrentPage("in_progress"), className: "bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors", children: "\u67E5\u770B" }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 200,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 196,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 187,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 186,
        columnNumber: 111
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Play, { size: 48, className: "mx-auto mb-3 opacity-50" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 206,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { children: "\u6682\u65E0\u6B63\u5728\u8FDB\u884C\u7684\u8054\u8D5B" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 207,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: "text-sm mt-1", children: "\u521B\u5EFA\u65B0\u8054\u8D5B\u5F00\u59CB\u6E38\u620F\u5427\uFF01" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 208,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 205,
        columnNumber: 38
      }, this) }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 185,
        columnNumber: 43
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "space-y-4", children: leagueHistory.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: leagueHistory.map((league) => /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("h4", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: league.league_name }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 215,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "Season ",
              league.season_number
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 218,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 214,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "text-right", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: formatDate(league.end_date) }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 223,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, children: formatDuration(league.start_date, league.end_date) }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 226,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 222,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 213,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "text-2xl", children: league.winner.avatar }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 233,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `font-medium ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`, children: [
            "\u{1F3C6} ",
            league.winner.name
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 235,
            columnNumber: 49
          }, this) }, void 0, false, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 234,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 232,
          columnNumber: 41
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Users, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 243,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_players,
              "\u4EBA"
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 244,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 242,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Calendar, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 249,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
              league.total_rounds,
              "\u8F6E"
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 250,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 248,
            columnNumber: 45
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-2 rounded ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(Trophy, { size: 14, className: `mx-auto mb-1 ${theme === "dark" ? "text-white/60" : "text-gray-500"}` }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 255,
              columnNumber: 49
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "\u5B8C\u6210" }, void 0, false, {
              fileName: "app/components/pages/LeagueManagementPage.tsx",
              lineNumber: 256,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueManagementPage.tsx",
            lineNumber: 254,
            columnNumber: 45
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 241,
          columnNumber: 41
        }, this)
      ] }, league.id, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 212,
        columnNumber: 62
      }, this)) }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 211,
        columnNumber: 53
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("div", { className: `p-8 text-center ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)(History, { size: 48, className: "mx-auto mb-3 opacity-50" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 263,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { children: "\u6682\u65E0\u5386\u53F2\u8054\u8D5B\u8BB0\u5F55" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 264,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime12.jsxDEV)("p", { className: "text-sm mt-1", children: "\u5B8C\u6210\u9996\u573A\u8054\u8D5B\u540E\uFF0C\u8BB0\u5F55\u5C06\u663E\u793A\u5728\u8FD9\u91CC" }, void 0, false, {
          fileName: "app/components/pages/LeagueManagementPage.tsx",
          lineNumber: 265,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 262,
        columnNumber: 38
      }, this) }, void 0, false, {
        fileName: "app/components/pages/LeagueManagementPage.tsx",
        lineNumber: 210,
        columnNumber: 30
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueManagementPage.tsx",
      lineNumber: 172,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/pages/LeagueManagementPage.tsx",
    lineNumber: 67,
    columnNumber: 10
  }, this);
};
_s12(LeagueManagementPage, "m6CeZx4d37p08jnUCWPJugYomlE=", false, function() {
  return [useTheme];
});
_c12 = LeagueManagementPage;
var LeagueManagementPage_default = LeagueManagementPage;
var _c12;
$RefreshReg$(_c12, "LeagueManagementPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/PlayerRankingsPage.tsx
var import_jsx_dev_runtime13 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\PlayerRankingsPage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s13 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\PlayerRankingsPage.tsx"
  );
  import.meta.hot.lastModified = "1754706045182.62";
}
var PlayerRankingsPage = ({
  players,
  onPlayerClick
}) => {
  _s13();
  const {
    theme
  } = useTheme();
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.championships !== a.championships) {
      return (b.championships || 0) - (a.championships || 0);
    }
    return b.score - a.score;
  });
  return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("h2", { className: "text-4xl font-bold text-orange-400 mb-2", children: "\u73A9\u5BB6\u6392\u884C\u699C" }, void 0, false, {
        fileName: "app/components/pages/PlayerRankingsPage.tsx",
        lineNumber: 43,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("p", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: "\u67E5\u770B\u6240\u6709\u73A9\u5BB6\u7684\u8BE6\u7EC6\u7EDF\u8BA1\u548C\u6392\u540D" }, void 0, false, {
        fileName: "app/components/pages/PlayerRankingsPage.tsx",
        lineNumber: 44,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/PlayerRankingsPage.tsx",
      lineNumber: 42,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800/50" : "bg-white/60 border border-gray-200/50"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("h3", { className: `text-2xl font-bold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(Trophy, { className: "text-yellow-400" }, void 0, false, {
          fileName: "app/components/pages/PlayerRankingsPage.tsx",
          lineNumber: 49,
          columnNumber: 21
        }, this),
        "\u603B\u6392\u884C\u699C"
      ] }, void 0, true, {
        fileName: "app/components/pages/PlayerRankingsPage.tsx",
        lineNumber: 48,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "space-y-4", children: sortedPlayers.map((player, index2) => {
        const stats = UTILS.calculatePlayerStats(player);
        return /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer transition-colors ${theme === "dark" ? "bg-gray-700/70 hover:bg-gray-600/70" : "bg-white/70 hover:bg-gray-100/70"}`, onClick: () => onPlayerClick(player), children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: `font-bold text-2xl w-8 text-center ${index2 === 0 ? "text-yellow-400" : index2 === 1 ? "text-gray-300" : index2 === 2 ? "text-orange-400" : "text-gray-500"}`, children: index2 + 1 }, void 0, false, {
              fileName: "app/components/pages/PlayerRankingsPage.tsx",
              lineNumber: 58,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: "text-3xl", children: player.avatar }, void 0, false, {
              fileName: "app/components/pages/PlayerRankingsPage.tsx",
              lineNumber: 61,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { className: `font-semibold text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: player.name }, void 0, false, {
                fileName: "app/components/pages/PlayerRankingsPage.tsx",
                lineNumber: 63,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `flex gap-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { children: [
                  "\u{1F3C6} ",
                  stats.championships,
                  "\u51A0"
                ] }, void 0, true, {
                  fileName: "app/components/pages/PlayerRankingsPage.tsx",
                  lineNumber: 65,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { children: [
                  "\u{1F3AE} ",
                  stats.totalGames,
                  "\u573A"
                ] }, void 0, true, {
                  fileName: "app/components/pages/PlayerRankingsPage.tsx",
                  lineNumber: 66,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { children: [
                  "\u{1F4CA} \u80DC\u7387",
                  stats.winRate,
                  "%"
                ] }, void 0, true, {
                  fileName: "app/components/pages/PlayerRankingsPage.tsx",
                  lineNumber: 67,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("span", { children: [
                  "\u{1F4C8} \u5E73\u5747\u6392\u540D",
                  stats.averagePlacement
                ] }, void 0, true, {
                  fileName: "app/components/pages/PlayerRankingsPage.tsx",
                  lineNumber: 68,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/pages/PlayerRankingsPage.tsx",
                lineNumber: 64,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/PlayerRankingsPage.tsx",
              lineNumber: 62,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/PlayerRankingsPage.tsx",
            lineNumber: 57,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "text-right", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: "text-2xl font-bold text-green-400", children: player.score }, void 0, false, {
              fileName: "app/components/pages/PlayerRankingsPage.tsx",
              lineNumber: 73,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "\u5F53\u524D\u5206\u6570" }, void 0, false, {
              fileName: "app/components/pages/PlayerRankingsPage.tsx",
              lineNumber: 74,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/PlayerRankingsPage.tsx",
            lineNumber: 72,
            columnNumber: 33
          }, this)
        ] }, player.id, true, {
          fileName: "app/components/pages/PlayerRankingsPage.tsx",
          lineNumber: 56,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/pages/PlayerRankingsPage.tsx",
        lineNumber: 53,
        columnNumber: 17
      }, this),
      players.length === 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("div", { className: `text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)(Users, { size: 48, className: "mx-auto mb-4 opacity-50" }, void 0, false, {
          fileName: "app/components/pages/PlayerRankingsPage.tsx",
          lineNumber: 81,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("p", { children: "\u8FD8\u6CA1\u6709\u6CE8\u518C\u7684\u73A9\u5BB6" }, void 0, false, {
          fileName: "app/components/pages/PlayerRankingsPage.tsx",
          lineNumber: 82,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime13.jsxDEV)("p", { className: "text-sm", children: "\u524D\u5F80\u73A9\u5BB6\u6CE8\u518C\u9875\u9762\u6DFB\u52A0\u73A9\u5BB6" }, void 0, false, {
          fileName: "app/components/pages/PlayerRankingsPage.tsx",
          lineNumber: 83,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/PlayerRankingsPage.tsx",
        lineNumber: 80,
        columnNumber: 42
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/PlayerRankingsPage.tsx",
      lineNumber: 47,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/pages/PlayerRankingsPage.tsx",
    lineNumber: 41,
    columnNumber: 10
  }, this);
};
_s13(PlayerRankingsPage, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c13 = PlayerRankingsPage;
var PlayerRankingsPage_default = PlayerRankingsPage;
var _c13;
$RefreshReg$(_c13, "PlayerRankingsPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/LeagueHistoryPage.tsx
var import_jsx_dev_runtime14 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\LeagueHistoryPage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s14 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\LeagueHistoryPage.tsx"
  );
  import.meta.hot.lastModified = "1754708240913.3633";
}
var LeagueHistoryPage = ({
  leagueHistory
}) => {
  _s14();
  const {
    theme
  } = useTheme();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays === 1 ? "1 \u5929" : `${diffDays} \u5929`;
  };
  if (leagueHistory.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "inline-flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(History, { className: "text-purple-400", size: 32 }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 51,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 50,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "text-left", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "\u8054\u8D5B\u5386\u53F2" }, void 0, false, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 54,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "League History" }, void 0, false, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 57,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 53,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 49,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 48,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `text-center p-10 ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg shadow-lg`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(History, { className: `mx-auto mb-4 ${theme === "dark" ? "text-white/40" : "text-gray-400"}`, size: 64 }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 63,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("h3", { className: `text-xl font-semibold mb-2 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: "\u6682\u65E0\u5386\u53F2\u8BB0\u5F55" }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 64,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u5B8C\u6210\u7B2C\u4E00\u4E2A\u8054\u8D5B\u540E\uFF0C\u5386\u53F2\u8BB0\u5F55\u5C06\u5728\u8FD9\u91CC\u663E\u793A" }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 65,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 62,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueHistoryPage.tsx",
      lineNumber: 47,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(History, { className: "text-purple-400", size: 32 }, void 0, false, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 73,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 72,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent"}`, children: "\u8054\u8D5B\u5386\u53F2" }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 76,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueHistory.length,
          " \u4E2A\u5DF2\u5B8C\u6210\u7684\u8054\u8D5B"
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 79,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 75,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/LeagueHistoryPage.tsx",
      lineNumber: 71,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/pages/LeagueHistoryPage.tsx",
      lineNumber: 70,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6", children: leagueHistory.map((league, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `relative ${theme === "dark" ? "bg-black/20" : "bg-white/60"} backdrop-blur-2xl border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} rounded-lg sm:rounded-xl shadow-lg overflow-hidden`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-gray-50/50 to-transparent"} rounded-lg sm:rounded-xl` }, void 0, false, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 88,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "relative z-10 p-4 sm:p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `p-2 rounded-lg ${index2 === 0 ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30" : theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Trophy, { className: index2 === 0 ? "text-yellow-400" : theme === "dark" ? "text-white/70" : "text-gray-600", size: 16 }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 95,
              columnNumber: 41
            }, this) }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 94,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("h3", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.league_name }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 98,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
                "Season ",
                league.season_number
              ] }, void 0, true, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 101,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 97,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 93,
            columnNumber: 33
          }, this),
          index2 === 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded text-xs font-medium text-yellow-400", children: "\u6700\u65B0" }, void 0, false, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 106,
            columnNumber: 49
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 92,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `p-3 rounded-lg mb-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Crown, { className: "text-yellow-400", size: 20 }, void 0, false, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 114,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `text-sm font-medium ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "\u51A0\u519B" }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 116,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: "text-lg", children: league.winner.avatar }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 118,
                columnNumber: 45
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `font-semibold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.winner.name }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 119,
                columnNumber: 45
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 117,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 115,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 113,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 112,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Users, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 131,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u53C2\u8D5B\u4EBA\u6570" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 132,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 130,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_players }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 134,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 129,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Target, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 140,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u603B\u8F6E\u6570" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 141,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 139,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: league.total_rounds }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 143,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 138,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 128,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)(Calendar, { size: 14, className: theme === "dark" ? "text-white/60" : "text-gray-500" }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 152,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u65F6\u95F4\u4FE1\u606F" }, void 0, false, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 153,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 151,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { className: "text-sm space-y-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "\u521B\u5EFA\uFF1A" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 157,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: formatDate(league.created_at) }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 158,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 156,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`, children: "\u6BD4\u8D5B\uFF1A" }, void 0, false, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 163,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("span", { className: `ml-1 ${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: [
                formatDate(league.start_date),
                " - ",
                formatDate(league.end_date)
              ] }, void 0, true, {
                fileName: "app/components/pages/LeagueHistoryPage.tsx",
                lineNumber: 164,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 162,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime14.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "\u6301\u7EED ",
              formatDuration(league.start_date, league.end_date)
            ] }, void 0, true, {
              fileName: "app/components/pages/LeagueHistoryPage.tsx",
              lineNumber: 168,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/pages/LeagueHistoryPage.tsx",
            lineNumber: 155,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/LeagueHistoryPage.tsx",
          lineNumber: 150,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/LeagueHistoryPage.tsx",
        lineNumber: 90,
        columnNumber: 25
      }, this)
    ] }, league.id, true, {
      fileName: "app/components/pages/LeagueHistoryPage.tsx",
      lineNumber: 87,
      columnNumber: 55
    }, this)) }, void 0, false, {
      fileName: "app/components/pages/LeagueHistoryPage.tsx",
      lineNumber: 86,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/pages/LeagueHistoryPage.tsx",
    lineNumber: 69,
    columnNumber: 10
  }, this);
};
_s14(LeagueHistoryPage, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c14 = LeagueHistoryPage;
var LeagueHistoryPage_default = LeagueHistoryPage;
var _c14;
$RefreshReg$(_c14, "LeagueHistoryPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/pages/ScheduleConfirmationPage.tsx
var import_jsx_dev_runtime15 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\pages\\\\ScheduleConfirmationPage.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s15 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\pages\\ScheduleConfirmationPage.tsx"
  );
  import.meta.hot.lastModified = "1754710002980.2498";
}
var ScheduleConfirmationPage = ({
  leagueState,
  players,
  onConfirmSchedule,
  onRerollSchedule
}) => {
  _s15();
  const {
    theme
  } = useTheme();
  if (!leagueState || !leagueState.schedule || leagueState.schedule.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." }, void 0, false, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 37,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "relative p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Calendar, { className: "text-orange-400", size: 32 }, void 0, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 43,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 42,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h1", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === "dark" ? "bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent"}`, children: "\u786E\u8BA4\u8D5B\u7A0B\u5B89\u6392" }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 46,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-base sm:text-lg font-medium mt-2 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
          leagueState.league_name,
          " - Season ",
          leagueState.season_number
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 49,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 45,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 41,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 40,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-yellow-50 border-yellow-200"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(TriangleAlert, { className: "text-yellow-500 flex-shrink-0", size: 20 }, void 0, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 59,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `font-semibold ${theme === "dark" ? "text-yellow-400" : "text-yellow-800"}`, children: "\u8BF7\u4ED4\u7EC6\u68C0\u67E5\u8D5B\u7A0B\u5B89\u6392" }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 61,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-sm mt-1 ${theme === "dark" ? "text-yellow-300/80" : "text-yellow-700"}`, children: "\u786E\u8BA4\u540E\u8054\u8D5B\u5C06\u6B63\u5F0F\u5F00\u59CB\u3002\u5982\u679C\u4E0D\u6EE1\u610F\u5F53\u524D\u5B89\u6392\uFF0C\u53EF\u4EE5\u91CD\u65B0\u751F\u6210\u8D5B\u7A0B\u3002" }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 64,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 60,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 58,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 57,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Trophy, { className: "text-orange-400", size: 20 }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 75,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 74,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u8054\u8D5B\u4FE1\u606F" }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 78,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 77,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 73,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u53C2\u8D5B\u4EBA\u6570" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 85,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            players.length,
            " \u4EBA"
          ] }, void 0, true, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 86,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 84,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u603B\u8F6E\u6570" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 91,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            leagueState.schedule.length,
            " \u8F6E"
          ] }, void 0, true, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 92,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 90,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"} col-span-2 sm:col-span-1`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-xs font-medium ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: "\u521B\u5EFA\u65F6\u95F4" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 97,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `font-bold text-sm ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.created_at && new Date(leagueState.created_at).toLocaleDateString("zh-CN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }) }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 98,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 96,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 83,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 72,
      columnNumber: 13
    }, this),
    leagueState.selected_special_rules && leagueState.selected_special_rules.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Settings, { className: "text-orange-400", size: 20 }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 114,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 113,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u7279\u6B8A\u89C4\u5219\u8BBE\u7F6E" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 117,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("p", { className: `text-xs ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u7CFB\u7EDF\u5C06\u4ECE\u4EE5\u4E0B\u89C4\u5219\u4E2D\u968F\u673A\u9009\u62E9" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 120,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 116,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 112,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: leagueState.selected_special_rules.map((rule, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-3 rounded-lg border text-sm ${theme === "dark" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-700"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Check, { size: 14, className: "text-orange-400 flex-shrink-0" }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 128,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { children: rule }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 129,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 127,
        columnNumber: 33
      }, this) }, index2, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 126,
        columnNumber: 82
      }, this)) }, void 0, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 125,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `mt-3 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`, children: [
        "\u5171 ",
        leagueState.selected_special_rules.length,
        " \u79CD\u53EF\u80FD\u7684\u7279\u6B8A\u89C4\u5219"
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 133,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 111,
      columnNumber: 101
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Calendar, { className: "text-blue-400", size: 20 }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 143,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 142,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u8D5B\u7A0B\u9884\u89C8" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 145,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 141,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("button", { onClick: onRerollSchedule, className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Dice6, { size: 16 }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 150,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("span", { className: "text-sm font-medium", children: "\u91CD\u65B0\u751F\u6210" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 151,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 149,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 140,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "space-y-4", children: leagueState.schedule.map((round, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("h4", { className: `font-bold text-lg ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: [
            "\u7B2C ",
            round.round,
            " \u8F6E"
          ] }, void 0, true, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 158,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: `px-2 py-1 rounded text-xs font-medium ${theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`, children: round.vpMode.name }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 161,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 157,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Shield, { className: "text-blue-400" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 166,
            columnNumber: 49
          }, this), title: "\u5B89\u5168\u724C", value: round.safeCards }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 166,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Bomb, { className: "text-red-400" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 167,
            columnNumber: 49
          }, this), title: "\u70B8\u5F39\u724C", value: round.bombCards }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 167,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Swords, { className: "text-yellow-400" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 168,
            columnNumber: 49
          }, this), title: "\u624B\u724C\u4E0A\u9650", value: round.handLimit === Infinity ? "\u65E0\u9650\u5236" : round.handLimit }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 168,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "sm:col-span-1 col-span-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Dices, { className: "text-purple-400" }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 170,
            columnNumber: 53
          }, this), title: "\u7279\u6B8A\u89C4\u5219", value: round.specialRule }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 170,
            columnNumber: 37
          }, this) }, void 0, false, {
            fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
            lineNumber: 169,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 165,
          columnNumber: 29
        }, this)
      ] }, round.round, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 156,
        columnNumber: 65
      }, this)) }, void 0, false, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 155,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 139,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("button", { onClick: onRerollSchedule, className: "flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 font-medium", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Dice6, { size: 20 }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 180,
          columnNumber: 21
        }, this),
        "\u91CD\u65B0\u751F\u6210\u8D5B\u7A0B"
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 179,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)("button", { onClick: onConfirmSchedule, className: "flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-200 shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime15.jsxDEV)(Check, { size: 20 }, void 0, false, {
          fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
          lineNumber: 184,
          columnNumber: 21
        }, this),
        "\u786E\u8BA4\u5E76\u5F00\u59CB\u8054\u8D5B"
      ] }, void 0, true, {
        fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
        lineNumber: 183,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
      lineNumber: 178,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/pages/ScheduleConfirmationPage.tsx",
    lineNumber: 39,
    columnNumber: 10
  }, this);
};
_s15(ScheduleConfirmationPage, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
  return [useTheme];
});
_c15 = ScheduleConfirmationPage;
var ScheduleConfirmationPage_default = ScheduleConfirmationPage;
var _c15;
$RefreshReg$(_c15, "ScheduleConfirmationPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/_index.tsx
var import_jsx_dev_runtime16 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s16 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1754712173393.3647";
}
var supabase;
function Index() {
  _s16();
  const [leagueState, setLeagueState] = (0, import_react7.useState)(null);
  const [players, setPlayers] = (0, import_react7.useState)([]);
  const [session, setSession] = (0, import_react7.useState)(null);
  const [isAuthReady, setIsAuthReady] = (0, import_react7.useState)(false);
  const [showPlayerModal, setShowPlayerModal] = (0, import_react7.useState)(false);
  const [showResultsModal, setShowResultsModal] = (0, import_react7.useState)(false);
  const [newPlayerName, setNewPlayerName] = (0, import_react7.useState)("");
  const [selectedAvatar, setSelectedAvatar] = (0, import_react7.useState)(GAME_RULES.AVATARS[0]);
  const [showPlayerProfileModal, setShowPlayerProfileModal] = (0, import_react7.useState)(false);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = (0, import_react7.useState)(null);
  const [winner, setWinner] = (0, import_react7.useState)(null);
  const [appId, setAppId] = (0, import_react7.useState)("default");
  const [currentPage, setCurrentPage] = (0, import_react7.useState)("home");
  const [sidebarOpen, setSidebarOpen] = (0, import_react7.useState)(false);
  const [sidebarCollapsed, setSidebarCollapsed] = (0, import_react7.useState)(false);
  const [musicPlaying, setMusicPlaying] = (0, import_react7.useState)(false);
  const [musicMuted, setMusicMuted] = (0, import_react7.useState)(true);
  const [leagueHistory, setLeagueHistory] = (0, import_react7.useState)([]);
  const [currentLeagueName, setCurrentLeagueName] = (0, import_react7.useState)("");
  const [nextSeasonNumber, setNextSeasonNumber] = (0, import_react7.useState)(1);
  (0, import_react7.useEffect)(() => {
    if (typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebarCollapsed");
      if (savedCollapsed !== null) {
        setSidebarCollapsed(JSON.parse(savedCollapsed));
      }
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);
  (0, import_react7.useEffect)(() => {
    if (typeof window !== "undefined") {
      const savedMuted = localStorage.getItem("musicMuted");
      if (savedMuted !== null) {
        setMusicMuted(JSON.parse(savedMuted));
      }
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("musicMuted", JSON.stringify(musicMuted));
    }
  }, [musicMuted]);
  const [theme, setTheme] = (0, import_react7.useState)("dark");
  (0, import_react7.useEffect)(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const canvasAppId = urlParams.get("app_id") || "default";
      setAppId(canvasAppId);
      const savedTheme = localStorage.getItem("boom-league-theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
      supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      supabase.auth.getSession().then(({
        data: {
          session: session2
        }
      }) => {
        setSession(session2);
        if (!session2) {
          supabase.auth.signInAnonymously();
        }
        setIsAuthReady(true);
      });
      const {
        data: {
          subscription
        }
      } = supabase.auth.onAuthStateChange((_event, session2) => {
        setSession(session2);
        setIsAuthReady(true);
      });
      return () => subscription.unsubscribe();
    }
  }, []);
  (0, import_react7.useEffect)(() => {
    if (!isAuthReady || !supabase)
      return;
    const loadLeagueHistory2 = async () => {
      if (!supabase || !appId)
        return;
      try {
        const {
          data: historyData,
          error
        } = await supabase.from("league_history").select("*").eq("app_id", appId).order("season_number", {
          ascending: false
        });
        if (error) {
          console.error("Error loading league history:", error);
          return;
        }
        if (historyData) {
          setLeagueHistory(historyData);
          const latestSeason = historyData.length > 0 ? historyData[0].season_number : 0;
          setNextSeasonNumber(latestSeason + 1);
          setCurrentLeagueName(`Boom League S${latestSeason + 1}`);
        }
      } catch (error) {
        console.error("Error in loadLeagueHistory:", error);
      }
    };
    const fetchInitialData = async () => {
      const {
        data: leagueData,
        error: leagueError
      } = await supabase.from("league_state").select("*").eq("app_id", appId).single();
      if (leagueData) {
        setLeagueState(leagueData);
        if (leagueData.winner)
          setWinner(leagueData.winner);
        else
          setWinner(null);
      } else {
        setLeagueState(null);
      }
      if (leagueError && leagueError.code !== "PGRST116")
        console.error("Error fetching league state:", leagueError);
      const {
        data: playersData,
        error: playersError
      } = await supabase.from("players").select("*").eq("app_id", appId).order("score", {
        ascending: false
      });
      if (playersData)
        setPlayers(playersData);
      if (playersError)
        console.error("Error fetching players:", playersError);
    };
    fetchInitialData();
    loadLeagueHistory2();
    const leagueChannel = supabase.channel(`league-state:${appId}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "league_state",
      filter: `app_id=eq.${appId}`
    }, (payload) => {
      const updatedState = payload.new;
      setLeagueState(updatedState);
      if (updatedState.winner)
        setWinner(updatedState.winner);
      else
        setWinner(null);
    }).subscribe();
    const playersChannel = supabase.channel(`players:${appId}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "players",
      filter: `app_id=eq.${appId}`
    }, (payload) => {
      if (payload.eventType === "INSERT") {
        setPlayers((currentPlayers) => {
          const exists = currentPlayers.some((p) => p.id === payload.new.id);
          const next = exists ? currentPlayers : [...currentPlayers, payload.new];
          return next.sort((a, b) => b.score - a.score);
        });
      }
      if (payload.eventType === "UPDATE") {
        setPlayers((currentPlayers) => currentPlayers.map((p) => p.id === payload.new.id ? payload.new : p).sort((a, b) => b.score - a.score));
      }
      if (payload.eventType === "DELETE") {
        setPlayers((currentPlayers) => currentPlayers.filter((p) => p.id !== payload.old.id));
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(leagueChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [isAuthReady, appId]);
  const handleAddPlayer = async () => {
    console.log("handleAddPlayer called with:", {
      newPlayerName,
      selectedAvatar,
      playersLength: players.length
    });
    if (newPlayerName.trim() === "" || players.length >= 6) {
      console.log("handleAddPlayer early return:", {
        nameEmpty: newPlayerName.trim() === "",
        tooManyPlayers: players.length >= 6
      });
      return;
    }
    const tempPlayer = {
      id: `temp_${Date.now()}`,
      app_id: appId,
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      runnerUp: 0,
      thirdPlace: 0
    };
    console.log("Adding temp player:", tempPlayer);
    setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));
    console.log("Inserting into Supabase...");
    const {
      data,
      error
    } = await supabase.from("players").insert({
      app_id: appId,
      name: tempPlayer.name,
      avatar: selectedAvatar,
      score: 0,
      history: [],
      championships: 0,
      runnerUp: 0,
      thirdPlace: 0
    }).select().single();
    console.log("Supabase insert result:", {
      data,
      error
    });
    if (error) {
      setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id));
      console.error("Add player failed:", error);
    } else if (data) {
      console.log("Successfully added player, updating temp player with real data:", data);
      setPlayers((curr) => curr.map((p) => p.id === tempPlayer.id ? data : p).sort((a, b) => b.score - a.score));
    }
    setNewPlayerName("");
    setSelectedAvatar(GAME_RULES.AVATARS[0]);
    setShowPlayerModal(false);
  };
  const handleDeletePlayer = async (playerId) => {
    const previous = players;
    setPlayers((curr) => curr.filter((p) => p.id !== playerId));
    const {
      error
    } = await supabase.from("players").delete().match({
      id: playerId,
      app_id: appId
    });
    if (error) {
      console.error("Delete player failed:", error);
      setPlayers(previous);
    }
  };
  const generateSchedule = (playerCount, selectedSpecialRules = GAME_RULES.SPECIAL_RULES) => {
    let schedule = [];
    for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
      const safeCardMultipliers = [1, 2, 3, 4];
      const bombCardOptions = [playerCount, playerCount + 1];
      const handLimits = [4, 5, 6, Infinity];
      schedule.push({
        round: i + 1,
        safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
        bombCards: UTILS.getRandomElement(bombCardOptions),
        handLimit: UTILS.getRandomElement(handLimits),
        vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
        specialRule: UTILS.getRandomElement(selectedSpecialRules)
      });
    }
    return schedule;
  };
  const handleConfirmSchedule = async () => {
    if (!leagueState)
      return;
    const confirmedLeagueState = {
      ...leagueState,
      status: "in_progress",
      current_round: 1
    };
    setLeagueState(confirmedLeagueState);
    const {
      error
    } = await supabase.from("league_state").update({
      status: "in_progress",
      current_round: 1
    }).eq("app_id", appId);
    if (error) {
      console.error("Confirm schedule failed:", error);
    }
  };
  const handleRerollSchedule = async () => {
    if (!leagueState)
      return;
    const selectedRules = leagueState.selected_special_rules || GAME_RULES.SPECIAL_RULES;
    const newSchedule = generateSchedule(players.length, selectedRules);
    const rerolledLeagueState = {
      ...leagueState,
      schedule: newSchedule
    };
    setLeagueState(rerolledLeagueState);
    const {
      error
    } = await supabase.from("league_state").update({
      schedule: newSchedule
    }).eq("app_id", appId);
    if (error) {
      console.error("Reroll schedule failed:", error);
    }
  };
  const handleStartLeague = async (selectedSpecialRules) => {
    if (players.length < 2)
      return;
    const schedule = generateSchedule(players.length, selectedSpecialRules);
    const currentDate = (/* @__PURE__ */ new Date()).toISOString();
    const leagueName = currentLeagueName || `Boom League S${nextSeasonNumber}`;
    const newLeagueState = {
      app_id: appId,
      status: "pending_confirmation",
      current_round: 0,
      schedule,
      winner: null,
      league_name: leagueName,
      season_number: nextSeasonNumber,
      start_date: currentDate,
      created_at: currentDate,
      selected_special_rules: selectedSpecialRules
    };
    setLeagueState(newLeagueState);
    const {
      error
    } = await supabase.from("league_state").upsert(newLeagueState, {
      onConflict: "app_id"
    });
    if (error) {
      console.error("Start league failed:", error);
    }
  };
  const handleResetLeague = async () => {
    setPlayers((curr) => curr.map((p) => ({
      ...p,
      score: 0,
      history: []
    })));
    setLeagueState({
      app_id: appId,
      status: "setup",
      current_round: 0,
      schedule: [],
      winner: null
    });
    setWinner(null);
    const [{
      error: pErr
    }, {
      error: lErr
    }] = await Promise.all([supabase.from("players").update({
      score: 0,
      history: []
    }).eq("app_id", appId), supabase.from("league_state").upsert({
      app_id: appId,
      status: "setup",
      current_round: 0,
      schedule: [],
      winner: null
    }, {
      onConflict: "app_id"
    })]);
    if (pErr || lErr) {
      console.error("Reset league errors:", pErr, lErr);
    }
  };
  const handleAbortLeague = async () => {
    if (leagueState && leagueState.current_round > 1) {
      await saveLeagueToHistory();
    }
    setPlayers((curr) => curr.map((p) => ({
      ...p,
      score: 0,
      history: []
    })));
    setLeagueState({
      app_id: appId,
      status: "setup",
      current_round: 0,
      schedule: [],
      winner: null
    });
    setWinner(null);
    setCurrentPage("league");
    const [{
      error: pErr
    }, {
      error: lErr
    }] = await Promise.all([supabase.from("players").update({
      score: 0,
      history: []
    }).eq("app_id", appId), supabase.from("league_state").upsert({
      app_id: appId,
      status: "setup",
      current_round: 0,
      schedule: [],
      winner: null
    }, {
      onConflict: "app_id"
    })]);
    if (pErr || lErr) {
      console.error("Abort league errors:", pErr, lErr);
    }
  };
  const handleBackToLeagueManagement = () => {
    setCurrentPage("league");
  };
  const handlePlayerClick = (player) => {
    setSelectedPlayerForProfile(player);
    setShowPlayerProfileModal(true);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("boom-league-theme", newTheme);
    }
  };
  const saveLeagueToHistory = async (finalLeagueState, finalPlayers) => {
    if (!finalLeagueState.winner || !finalLeagueState.league_name)
      return;
    const historyEntry = {
      app_id: appId,
      league_name: finalLeagueState.league_name,
      season_number: finalLeagueState.season_number || nextSeasonNumber,
      start_date: finalLeagueState.start_date || (/* @__PURE__ */ new Date()).toISOString(),
      end_date: (/* @__PURE__ */ new Date()).toISOString(),
      winner: finalLeagueState.winner,
      final_standings: [...finalPlayers].sort((a, b) => b.score - a.score),
      total_rounds: finalLeagueState.current_round,
      total_players: finalPlayers.length,
      created_at: finalLeagueState.created_at || finalLeagueState.start_date || (/* @__PURE__ */ new Date()).toISOString()
    };
    const {
      error
    } = await supabase.from("league_history").insert(historyEntry);
    if (error) {
      console.error("Error saving league to history:", error);
    } else {
      await loadLeagueHistory();
    }
  };
  const handleAdvanceRound = async (results) => {
    if (!leagueState)
      return;
    const currentRoundIndex = leagueState.current_round - 1;
    const vpMode = leagueState.schedule[currentRoundIndex].vpMode;
    const updatedPlayersData = [...players];
    const playerUpdates = [];
    for (const [index2, playerId] of results.entries()) {
      const player = updatedPlayersData.find((p) => p.id === playerId);
      if (!player)
        continue;
      const points = vpMode.scores[index2] || 0;
      const newScore = player.score + points;
      player.score = newScore;
      player.history = [...player.history, {
        round: leagueState.current_round,
        placement: index2 + 1
      }];
      playerUpdates.push(supabase.from("players").update({
        score: newScore,
        history: player.history
      }).match({
        id: playerId,
        app_id: appId
      }));
    }
    setPlayers(updatedPlayersData.sort((a, b) => b.score - a.score));
    await Promise.all(playerUpdates);
    const potentialWinners = updatedPlayersData.filter((p) => p.score >= GAME_RULES.WIN_SCORE).sort((a, b) => b.score - a.score);
    let potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null;
    let nextRound = leagueState.current_round + 1;
    let newStatus = leagueState.status;
    let finalWinner = null;
    if (potentialWinner) {
      finalWinner = {
        name: potentialWinner.name,
        avatar: potentialWinner.avatar,
        reason: `\u5728\u7B2C ${leagueState.current_round} \u8F6E\u7387\u5148\u8FBE\u5230 ${potentialWinner.score} \u5206\uFF01`
      };
      newStatus = "finished";
      potentialWinner.championships += 1;
      playerUpdates.push(supabase.from("players").update({
        championships: potentialWinner.championships
      }).match({
        id: potentialWinner.id,
        app_id: appId
      }));
    } else if (nextRound > GAME_RULES.MAX_ROUNDS) {
      newStatus = "finished";
      const sortedPlayers = updatedPlayersData.sort((a, b) => b.score - a.score);
      const topScore = sortedPlayers[0].score;
      const winners = sortedPlayers.filter((p) => p.score === topScore);
      if (winners.length > 1) {
        finalWinner = {
          name: winners.map((w) => w.name).join(" \u548C "),
          avatar: "\u2694\uFE0F",
          reason: `5\u8F6E\u540E\u5E73\u5206 (${topScore}\u5206)\uFF0C\u9700\u8981\u8FDB\u884C\u52A0\u8D5B\u5BF9\u51B3\uFF01`
        };
      } else {
        finalWinner = {
          name: sortedPlayers[0].name,
          avatar: sortedPlayers[0].avatar,
          reason: `5\u8F6E\u540E\u4EE5\u6700\u9AD8\u5206 (${topScore}\u5206) \u83B7\u80DC\uFF01`
        };
        const champion = sortedPlayers[0];
        champion.championships += 1;
        playerUpdates.push(supabase.from("players").update({
          championships: champion.championships
        }).match({
          id: champion.id,
          app_id: appId
        }));
        if (sortedPlayers.length >= 2) {
          const runnerUp = sortedPlayers[1];
          runnerUp.runnerUp += 1;
          playerUpdates.push(supabase.from("players").update({
            runnerUp: runnerUp.runnerUp
          }).match({
            id: runnerUp.id,
            app_id: appId
          }));
        }
        if (sortedPlayers.length >= 3) {
          const thirdPlace = sortedPlayers[2];
          thirdPlace.thirdPlace += 1;
          playerUpdates.push(supabase.from("players").update({
            thirdPlace: thirdPlace.thirdPlace
          }).match({
            id: thirdPlace.id,
            app_id: appId
          }));
        }
      }
    }
    setLeagueState((curr) => ({
      ...curr ?? {},
      app_id: appId,
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner,
      schedule: curr?.schedule ?? leagueState.schedule
    }));
    await supabase.from("league_state").update({
      current_round: nextRound,
      status: newStatus,
      winner: finalWinner
    }).eq("app_id", appId);
    if (newStatus === "finished" && finalWinner) {
      const finalLeagueState = {
        ...leagueState,
        current_round: nextRound,
        status: newStatus,
        winner: finalWinner,
        end_date: (/* @__PURE__ */ new Date()).toISOString()
      };
      await saveLeagueToHistory(finalLeagueState, updatedPlayersData);
    }
    setShowResultsModal(false);
  };
  const renderInProgress = () => {
    if (!leagueState)
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 619,
        columnNumber: 30
      }, this);
    if (leagueState.status === "setup") {
      setCurrentPage("league");
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-white", children: "\u91CD\u5B9A\u5411\u5230\u8054\u8D5B\u7BA1\u7406..." }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 624,
        columnNumber: 14
      }, this);
    }
    if (leagueState.status === "finished") {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === "dark" ? "bg-gray-800/70" : "bg-white/80"}`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Crown, { className: "text-yellow-400", size: 60 }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 629,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h2", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300", children: leagueState.league_name || "\u8054\u8D5B\u7ED3\u675F\uFF01" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 631,
            columnNumber: 29
          }, this),
          leagueState.season_number && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: `text-lg sm:text-xl mt-2 ${theme === "dark" ? "text-yellow-400/80" : "text-yellow-600"}`, children: [
            "Season ",
            leagueState.season_number,
            " \u5B8C\u6210"
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 634,
            columnNumber: 59
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 630,
          columnNumber: 25
        }, this),
        leagueState.winner && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(import_jsx_dev_runtime16.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4", children: leagueState.winner.avatar }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 639,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: `text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: leagueState.winner.name }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 640,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: `text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`, children: leagueState.winner.reason }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 641,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 638,
          columnNumber: 48
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: handleResetLeague, className: "mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base", children: "\u5F00\u542F\u65B0\u8054\u8D5B" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 643,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 628,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 627,
        columnNumber: 14
      }, this);
    }
    if (!leagueState.schedule || leagueState.schedule.length === 0)
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-white", children: "\u52A0\u8F7D\u4E2D..." }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 649,
        columnNumber: 76
      }, this);
    const currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
    if (!currentRoundConfig)
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-white", children: "\u6BD4\u8D5B\u7ED3\u675F\uFF01" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 651,
        columnNumber: 37
      }, this);
    return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Gamepad2, { className: "text-orange-400", size: 20 }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 658,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 657,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h1", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: "\u8054\u8D5B\u8FDB\u884C\u4E2D" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 661,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
              "\u7B2C ",
              leagueState.current_round,
              " \u8F6E / \u5171 ",
              GAME_RULES.MAX_ROUNDS,
              " \u8F6E"
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 664,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 660,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 656,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: handleBackToLeagueManagement, className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${theme === "dark" ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50" : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 hover:text-gray-900 border border-gray-300/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ChevronLeft, { size: 16 }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 671,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "hidden xs:inline", children: "\u8FD4\u56DE\u7BA1\u7406" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 672,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "xs:hidden", children: "\u8FD4\u56DE" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 673,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 670,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: () => {
            if (window.confirm("\u786E\u5B9A\u8981\u4E2D\u6B62\u5F53\u524D\u8054\u8D5B\u5417\uFF1F\u8FDB\u5EA6\u5C06\u4F1A\u4FDD\u5B58\u5230\u5386\u53F2\u8BB0\u5F55\u4E2D\u3002")) {
              handleAbortLeague();
            }
          }, className: `flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${theme === "dark" ? "bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800/50" : "bg-red-100/50 hover:bg-red-200/50 text-red-700 hover:text-red-800 border border-red-300/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(X, { size: 16 }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 680,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "hidden xs:inline", children: "\u4E2D\u6B62\u8054\u8D5B" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 681,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "xs:hidden", children: "\u4E2D\u6B62" }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 682,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 675,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 669,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 655,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 654,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "xl:col-span-1 flex flex-col gap-4 sm:gap-6 order-2 xl:order-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Leaderboard_default, { players, onPlayerClick: handlePlayerClick }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 691,
          columnNumber: 25
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 690,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "xl:col-span-2 flex flex-col gap-4 sm:gap-6 order-1 xl:order-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h2", { className: `text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400`, children: [
                "\u7B2C ",
                leagueState.current_round,
                " / ",
                GAME_RULES.MAX_ROUNDS,
                " \u8F6E"
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 697,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: () => setShowResultsModal(true), className: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ClipboardList, { size: 18, className: "flex-shrink-0" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 699,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "hidden xs:inline", children: "\u8F93\u5165\u672C\u8F6E\u7ED3\u679C" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 700,
                  columnNumber: 33
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "xs:hidden", children: "\u7ED3\u679C" }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 701,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 698,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 696,
              columnNumber: 26
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Shield, { className: "text-blue-400" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 705,
                columnNumber: 45
              }, this), title: "\u5B89\u5168\u724C\u6570\u91CF", value: currentRoundConfig.safeCards }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 705,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Bomb, { className: "text-red-400" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 706,
                columnNumber: 45
              }, this), title: "\u70B8\u5F39\u724C\u6570\u91CF", value: currentRoundConfig.bombCards }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 706,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Swords, { className: "text-yellow-400" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 707,
                columnNumber: 45
              }, this), title: "\u51FA\u6218\u624B\u724C\u4E0A\u9650", value: currentRoundConfig.handLimit === Infinity ? "\u65E0\u9650\u5236" : currentRoundConfig.handLimit }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 707,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Trophy, { className: "text-green-400" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 708,
                columnNumber: 45
              }, this), title: "VP \u5956\u52B1\u6A21\u5F0F", value: currentRoundConfig.vpMode.name }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 708,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(InfoCard_default, { icon: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Dices, { className: "text-purple-400" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 709,
                columnNumber: 45
              }, this), title: "\u7279\u6B8A\u89C4\u5219", value: currentRoundConfig.specialRule }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 709,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 704,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 695,
            columnNumber: 21
          }, this),
          leagueState.league_name && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-gray-200/50"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"} border`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Trophy, { className: "text-orange-400", size: 20 }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 717,
                columnNumber: 37
              }, this) }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 716,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h3", { className: `text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white/95" : "text-gray-900"}`, children: leagueState.league_name }, void 0, false, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 720,
                  columnNumber: 37
                }, this),
                leagueState.season_number && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("p", { className: `text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: [
                  "Season ",
                  leagueState.season_number
                ] }, void 0, true, {
                  fileName: "app/routes/_index.tsx",
                  lineNumber: 723,
                  columnNumber: 67
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 719,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 715,
              columnNumber: 29
            }, this),
            leagueState.created_at && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-100/50"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: `${theme === "dark" ? "text-white/60" : "text-gray-600"}`, children: "\u521B\u5EFA\u65F6\u95F4\uFF1A" }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 730,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: `${theme === "dark" ? "text-white/90" : "text-gray-900"}`, children: new Date(leagueState.created_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) }, void 0, false, {
                fileName: "app/routes/_index.tsx",
                lineNumber: 731,
                columnNumber: 41
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 729,
              columnNumber: 37
            }, this) }, void 0, false, {
              fileName: "app/routes/_index.tsx",
              lineNumber: 728,
              columnNumber: 56
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 714,
            columnNumber: 49
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ScheduleTimeline_default, { schedule: leagueState.schedule, currentRound: leagueState.current_round }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 744,
            columnNumber: 22
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(SoundEffectsBox_default, {}, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 745,
            columnNumber: 22
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 693,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 688,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 652,
      columnNumber: 12
    }, this);
  };
  const renderCurrentPage = () => {
    if (!isAuthReady) {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "text-center text-2xl p-8", children: "\u6B63\u5728\u8FDE\u63A5\u670D\u52A1\u5668..." }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 752,
        columnNumber: 14
      }, this);
    }
    if (leagueState && leagueState.status === "pending_confirmation") {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ScheduleConfirmationPage_default, { leagueState, players, onConfirmSchedule: handleConfirmSchedule, onRerollSchedule: handleRerollSchedule }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 757,
        columnNumber: 14
      }, this);
    }
    switch (currentPage) {
      case "home":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(HomePage_default, { leagueState, players, handleStartLeague, handleResetLeague, handlePlayerClick, setCurrentPage }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 761,
          columnNumber: 16
        }, this);
      case "registration":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(PlayerRegistrationPage_default, { players, handleAddPlayer, handleDeletePlayer, handlePlayerClick, newPlayerName, setNewPlayerName, selectedAvatar, setSelectedAvatar, showPlayerModal, setShowPlayerModal }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 763,
          columnNumber: 16
        }, this);
      case "league":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(LeagueManagementPage_default, { leagueState, players, handleStartLeague, handleResetLeague, currentLeagueName, setCurrentLeagueName, nextSeasonNumber, leagueHistory, setCurrentPage }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 765,
          columnNumber: 16
        }, this);
      case "in_progress":
        return renderInProgress();
      case "rankings":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(PlayerRankingsPage_default, { players, onPlayerClick: handlePlayerClick }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 769,
          columnNumber: 16
        }, this);
      case "history":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(LeagueHistoryPage_default, { leagueHistory }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 771,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(HomePage_default, { leagueState, players, handleStartLeague, handleResetLeague, handlePlayerClick }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 773,
          columnNumber: 16
        }, this);
    }
  };
  const themeClasses = {
    container: theme === "dark" ? "min-h-screen bg-[#0a0a0a] text-white font-sans flex relative overflow-hidden" : "min-h-screen bg-gray-50 text-gray-900 font-sans flex relative overflow-hidden",
    background: theme === "dark" ? "absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" : "absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100",
    radialGlow1: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.02)_0%,_transparent_50%)]",
    radialGlow2: theme === "dark" ? "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.08)_0%,_transparent_50%)]" : "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.06)_0%,_transparent_50%)]",
    pattern: theme === "dark" ? "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(255,255,255,0.02)_49%,_rgba(255,255,255,0.02)_51%,_transparent_52%)] bg-[length:20px_20px]" : "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.01)_49%,_rgba(0,0,0,0.01)_51%,_transparent_52%)] bg-[length:20px_20px]"
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ThemeContext.Provider, { value: {
    theme,
    toggleTheme
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: themeClasses.container, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: themeClasses.background }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 788,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: themeClasses.radialGlow1 }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 789,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: themeClasses.radialGlow2 }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 790,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: themeClasses.pattern }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 791,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Sidebar_default, { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, musicPlaying, setMusicPlaying, musicMuted, setMusicMuted }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 793,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-0"} relative`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("header", { className: `lg:hidden flex items-center justify-between p-3 sm:p-4 border-b ${theme === "dark" ? "border-white/10 bg-black/40" : "border-gray-200/50 bg-white/80"} backdrop-blur-2xl sticky top-0 z-40`, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: () => setSidebarOpen(true), className: `p-2 sm:p-2.5 rounded-lg transition-all duration-200 border border-transparent active:scale-95 ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Menu, { size: 18 }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 799,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 798,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Cat, { className: "text-orange-400", size: 16 }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 803,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 802,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("h1", { className: `text-sm sm:text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} tracking-tight`, children: "Boom League" }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 805,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 801,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "w-8 sm:w-10" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 807,
          columnNumber: 25
        }, this),
        " "
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 797,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("main", { className: "p-3 sm:p-4 md:p-6 lg:p-8 relative z-10 min-h-screen", children: renderCurrentPage() }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 811,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 795,
      columnNumber: 17
    }, this),
    showPlayerModal && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Modal_default, { onClose: () => setShowPlayerModal(false), title: "Add New Player", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: `font-medium mb-2 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Player Name" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 819,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("input", { type: "text", value: newPlayerName, onChange: (e) => setNewPlayerName(e.target.value), placeholder: "Enter player name", className: `w-full p-3 sm:p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm text-base ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-white/80 text-gray-900 border-gray-200"}` }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 820,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 818,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "mb-4 sm:mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("label", { className: `font-medium mb-2 sm:mb-3 block text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`, children: "Choose Avatar" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 824,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-gray-50/80 border-gray-200"}`, children: GAME_RULES.AVATARS.map((avatar, index2) => /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: () => setSelectedAvatar(avatar), className: `text-lg sm:text-xl p-2 sm:p-2.5 rounded-lg transition-all duration-200 border active:scale-95 ${selectedAvatar === avatar ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110" : theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105" : "bg-white/50 border-gray-200 hover:bg-gray-100/50 hover:scale-105"}`, children: avatar }, index2, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 826,
          columnNumber: 80
        }, this)) }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 825,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 823,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: handleAddPlayer, className: "relative group w-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 active:from-emerald-500/40 active:to-emerald-600/40 text-emerald-400 font-semibold py-3 sm:py-4 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: "relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(Plus, { size: 18 }, void 0, false, {
            fileName: "app/routes/_index.tsx",
            lineNumber: 834,
            columnNumber: 37
          }, this),
          "Add Player"
        ] }, void 0, true, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 833,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 837,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 832,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 817,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 816,
      columnNumber: 37
    }, this),
    showResultsModal && leagueState && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(ResultsModal_default, { players, onClose: () => setShowResultsModal(false), onSubmit: handleAdvanceRound, round: leagueState.current_round }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 842,
      columnNumber: 53
    }, this),
    showPlayerProfileModal && selectedPlayerForProfile && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)(PlayerProfileModal_default, { player: selectedPlayerForProfile, onClose: () => {
      setShowPlayerProfileModal(false);
      setSelectedPlayerForProfile(null);
    } }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 844,
      columnNumber: 72
    }, this),
    !musicMuted && /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "fixed bottom-4 right-4 z-50 max-w-[90vw] sm:max-w-none", children: /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: `${theme === "dark" ? "bg-black/80" : "bg-white/80"} backdrop-blur-md rounded-lg border ${theme === "dark" ? "border-white/10" : "border-gray-200/50"} p-2 sm:p-3 shadow-lg`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("iframe", { width: "280", height: "160", src: `https://www.youtube.com/embed/FeJKBFWYB0o?autoplay=${musicPlaying ? "1" : "0"}&loop=1&playlist=FeJKBFWYB0o&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&volume=30`, title: "Background Music", frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", className: "rounded w-full max-w-[280px] h-[160px]" }, void 0, false, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 852,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("div", { className: "flex items-center justify-between mt-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("span", { className: `text-xs ${theme === "dark" ? "text-white/70" : "text-gray-600"}`, children: "Background Music" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 854,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime16.jsxDEV)("button", { onClick: () => {
          setMusicMuted(true);
          setMusicPlaying(false);
        }, className: `text-xs px-2 py-1 rounded transition-colors ${theme === "dark" ? "text-white/70 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`, children: "Hide" }, void 0, false, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 855,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 853,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 851,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 850,
      columnNumber: 33
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 787,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 783,
    columnNumber: 10
  }, this);
}
_s16(Index, "xJSYqK2cSgVxOeQTLoTed68m5kI=");
_c16 = Index;
var _c16;
$RefreshReg$(_c16, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default
};
/*! Bundled license information:

lucide-react/dist/esm/shared/src/utils.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/defaultAttributes.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/Icon.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/createLucideIcon.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/bar-chart-3.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/bomb.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/book.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/calendar.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/cat.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/check.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/chevron-left.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/chevron-right.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/circle-help.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/clipboard-list.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/crown.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/dice-6.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/dices.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/frown.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/gamepad-2.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/history.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/home.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/menu.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/moon.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/party-popper.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/pause.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/play.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/plus.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/scroll-text.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/settings.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/shield.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/smile.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/sun.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/swords.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/target.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/trash-2.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/triangle-alert.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/trophy.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/user-plus.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/users.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/volume-2.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/volume-x.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/wind.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/icons/x.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.395.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=/build/routes/_index-W3APMEW7.js.map
