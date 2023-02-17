import { Query, Store } from "@datorama/akita";
import { Observable } from "rxjs";

import { useEffect, useState } from "react";

export function useAkita<
  TStore extends Store,
  TQuery extends Query<TStore>,
  TService extends any
>(
  query: TQuery,
  service: TService,
  queryTerms: (keyof TQuery)[]
): [TQuery[keyof TQuery][], TService[keyof TService][]] {
  const queries = queryTerms.map((term) => {
    // TODO no any
    const [retrievedQuery, setRetrievedQuery] = useState<any>();
    const retrievedQueryObservable = query[term] as Observable<any>;
    useEffect(() => {
      retrievedQueryObservable.subscribe({
        next(observedValue) {
          setRetrievedQuery(observedValue);
        },
      });
    }, []);
    return retrievedQuery;
  });
  return [queries, []];
}
