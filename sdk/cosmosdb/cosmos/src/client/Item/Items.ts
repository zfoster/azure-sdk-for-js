// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import uuid from "uuid/v4";
import { ChangeFeedIterator } from "../../ChangeFeedIterator";
import { ChangeFeedOptions } from "../../ChangeFeedOptions";
import { ClientContext } from "../../ClientContext";
import { getIdFromLink, getPathFromLink, isResourceValid, ResourceType } from "../../common";
import { extractPartitionKey } from "../../extractPartitionKey";
import { FetchFunctionCallback, SqlQuerySpec } from "../../queryExecutionContext";
import { QueryIterator } from "../../queryIterator";
import { FeedOptions, RequestOptions } from "../../request";
import { Container, PartitionKeyRange } from "../Container";
import { Item } from "./Item";
import { ItemDefinition } from "./ItemDefinition";
import { ItemResponse } from "./ItemResponse";
import { MurmurHash } from "../../utils/murmurHash";

/**
 * @ignore
 * @param options
 */
function isChangeFeedOptions(options: unknown): options is ChangeFeedOptions {
  const optionsType = typeof options;
  return (
    options && !(optionsType === "string" || optionsType === "boolean" || optionsType === "number")
  );
}

/**
 * Operations for creating new items, and reading/querying all items
 *
 * @see {@link Item} for reading, replacing, or deleting an existing container; use `.item(id)`.
 */
export class Items {
  /**
   * Create an instance of {@link Items} linked to the parent {@link Container}.
   * @param container The parent container.
   * @hidden
   */
  constructor(
    public readonly container: Container,
    private readonly clientContext: ClientContext
  ) {}

  /**
   * Queries all items.
   * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
   * @param options Used for modifying the request (for instance, specifying the partition key).
   * @example Read all items to array.
   * ```typescript
   * const querySpec: SqlQuerySpec = {
   *   query: "SELECT * FROM Families f WHERE f.lastName = @lastName",
   *   parameters: [
   *     {name: "@lastName", value: "Hendricks"}
   *   ]
   * };
   * const {result: items} = await items.query(querySpec).fetchAll();
   * ```
   */
  public query(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<any>;
  /**
   * Queries all items.
   * @param query Query configuration for the operation. See {@link SqlQuerySpec} for more info on how to configure a query.
   * @param options Used for modifying the request (for instance, specifying the partition key).
   * @example Read all items to array.
   * ```typescript
   * const querySpec: SqlQuerySpec = {
   *   query: "SELECT firstname FROM Families f WHERE f.lastName = @lastName",
   *   parameters: [
   *     {name: "@lastName", value: "Hendricks"}
   *   ]
   * };
   * const {result: items} = await items.query<{firstName: string}>(querySpec).fetchAll();
   * ```
   */
  public query<T>(query: string | SqlQuerySpec, options?: FeedOptions): QueryIterator<T>;
  public query<T>(query: string | SqlQuerySpec, options: FeedOptions = {}): QueryIterator<T> {
    const path = getPathFromLink(this.container.url, ResourceType.item);
    const id = getIdFromLink(this.container.url);

    const fetchFunction: FetchFunctionCallback = (innerOptions: FeedOptions) => {
      return this.clientContext.queryFeed({
        path,
        resourceType: ResourceType.item,
        resourceId: id,
        resultFn: (result) => (result ? result.Documents : []),
        query,
        options: innerOptions,
        partitionKey: options.partitionKey
      });
    };

    return new QueryIterator(
      this.clientContext,
      query,
      options,
      fetchFunction,
      this.container.url,
      ResourceType.item
    );
  }

  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   *
   * @param partitionKey
   * @param changeFeedOptions
   * @deprecated Use `changeFeed` instead.
   *
   * @example Read from the beginning of the change feed.
   * ```javascript
   * const iterator = items.readChangeFeed({ startFromBeginning: true });
   * const firstPage = await iterator.fetchNext();
   * const firstPageResults = firstPage.result
   * const secondPage = await iterator.fetchNext();
   * ```
   */
  public readChangeFeed(
    partitionKey: string | number | boolean,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<any>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   * @deprecated Use `changeFeed` instead.
   *
   * @param changeFeedOptions
   */
  public readChangeFeed(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<any>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   * @deprecated Use `changeFeed` instead.
   *
   * @param partitionKey
   * @param changeFeedOptions
   */
  public readChangeFeed<T>(
    partitionKey: string | number | boolean,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<T>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   * @deprecated Use `changeFeed` instead.
   *
   * @param changeFeedOptions
   */
  public readChangeFeed<T>(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<T>;
  public readChangeFeed<T>(
    partitionKeyOrChangeFeedOptions?: string | number | boolean | ChangeFeedOptions,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<T> {
    if (isChangeFeedOptions(partitionKeyOrChangeFeedOptions)) {
      return this.changeFeed(partitionKeyOrChangeFeedOptions);
    } else {
      return this.changeFeed(partitionKeyOrChangeFeedOptions, changeFeedOptions);
    }
  }

  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   *
   * @param partitionKey
   * @param changeFeedOptions
   *
   * @example Read from the beginning of the change feed.
   * ```javascript
   * const iterator = items.readChangeFeed({ startFromBeginning: true });
   * const firstPage = await iterator.fetchNext();
   * const firstPageResults = firstPage.result
   * const secondPage = await iterator.fetchNext();
   * ```
   */
  public changeFeed(
    partitionKey: string | number | boolean,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<any>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   *
   * @param changeFeedOptions
   */
  public changeFeed(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<any>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   *
   * @param partitionKey
   * @param changeFeedOptions
   */
  public changeFeed<T>(
    partitionKey: string | number | boolean,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<T>;
  /**
   * Create a `ChangeFeedIterator` to iterate over pages of changes
   *
   * @param changeFeedOptions
   */
  public changeFeed<T>(changeFeedOptions?: ChangeFeedOptions): ChangeFeedIterator<T>;
  public changeFeed<T>(
    partitionKeyOrChangeFeedOptions?: string | number | boolean | ChangeFeedOptions,
    changeFeedOptions?: ChangeFeedOptions
  ): ChangeFeedIterator<T> {
    let partitionKey: string | number | boolean;
    if (!changeFeedOptions && isChangeFeedOptions(partitionKeyOrChangeFeedOptions)) {
      partitionKey = undefined;
      changeFeedOptions = partitionKeyOrChangeFeedOptions;
    } else if (
      partitionKeyOrChangeFeedOptions !== undefined &&
      !isChangeFeedOptions(partitionKeyOrChangeFeedOptions)
    ) {
      partitionKey = partitionKeyOrChangeFeedOptions;
    }

    if (!changeFeedOptions) {
      changeFeedOptions = {};
    }

    const path = getPathFromLink(this.container.url, ResourceType.item);
    const id = getIdFromLink(this.container.url);
    return new ChangeFeedIterator<T>(this.clientContext, id, path, partitionKey, changeFeedOptions);
  }

  /**
   * Read all items.
   *
   * There is no set schema for JSON items. They may contain any number of custom properties.
   *
   * @param options Used for modifying the request (for instance, specifying the partition key).
   * @example Read all items to array.
   * ```typescript
   * const {body: containerList} = await items.readAll().fetchAll();
   * ```
   */
  public readAll(options?: FeedOptions): QueryIterator<ItemDefinition>;
  /**
   * Read all items.
   *
   * Any provided type, T, is not necessarily enforced by the SDK.
   * You may get more or less properties and it's up to your logic to enforce it.
   *
   * There is no set schema for JSON items. They may contain any number of custom properties.
   *
   * @param options Used for modifying the request (for instance, specifying the partition key).
   * @example Read all items to array.
   * ```typescript
   * const {body: containerList} = await items.readAll().fetchAll();
   * ```
   */
  public readAll<T extends ItemDefinition>(options?: FeedOptions): QueryIterator<T>;
  public readAll<T extends ItemDefinition>(options?: FeedOptions): QueryIterator<T> {
    return this.query<T>("SELECT * from c", options);
  }

  /**
   * Create an item.
   *
   * Any provided type, T, is not necessarily enforced by the SDK.
   * You may get more or less properties and it's up to your logic to enforce it.
   *
   * There is no set schema for JSON items. They may contain any number of custom properties.
   *
   * @param body Represents the body of the item. Can contain any number of user defined properties.
   * @param options Used for modifying the request (for instance, specifying the partition key).
   */
  public async create<T extends ItemDefinition = any>(
    body: T,
    options: RequestOptions = {}
  ): Promise<ItemResponse<T>> {
    const { resource: partitionKeyDefinition } = await this.container.readPartitionKeyDefinition();
    const partitionKey = extractPartitionKey(body, partitionKeyDefinition);

    // Generate random document id if the id is missing in the payload and
    // options.disableAutomaticIdGeneration != true
    if ((body.id === undefined || body.id === "") && !options.disableAutomaticIdGeneration) {
      body.id = uuid();
    }

    const err = {};
    if (!isResourceValid(body, err)) {
      throw err;
    }

    const path = getPathFromLink(this.container.url, ResourceType.item);
    const id = getIdFromLink(this.container.url);

    const response = await this.clientContext.create<T>({
      body,
      path,
      resourceType: ResourceType.item,
      resourceId: id,
      options,
      partitionKey
    });

    const ref = new Item(
      this.container,
      (response.result as any).id,
      partitionKey,
      this.clientContext
    );
    return new ItemResponse(
      response.result,
      response.headers,
      response.code,
      response.substatus,
      ref
    );
  }

  /**
   * Upsert an item.
   *
   * There is no set schema for JSON items. They may contain any number of custom properties.
   *
   * @param body Represents the body of the item. Can contain any number of user defined properties.
   * @param options Used for modifying the request (for instance, specifying the partition key).
   */
  public async upsert(body: any, options?: RequestOptions): Promise<ItemResponse<ItemDefinition>>;
  /**
   * Upsert an item.
   *
   * Any provided type, T, is not necessarily enforced by the SDK.
   * You may get more or less properties and it's up to your logic to enforce it.
   *
   * There is no set schema for JSON items. They may contain any number of custom properties.
   *
   * @param body Represents the body of the item. Can contain any number of user defined properties.
   * @param options Used for modifying the request (for instance, specifying the partition key).
   */
  public async upsert<T extends ItemDefinition>(
    body: T,
    options?: RequestOptions
  ): Promise<ItemResponse<T>>;
  public async upsert<T extends ItemDefinition>(
    body: T,
    options: RequestOptions = {}
  ): Promise<ItemResponse<T>> {
    const { resource: partitionKeyDefinition } = await this.container.readPartitionKeyDefinition();
    const partitionKey = extractPartitionKey(body, partitionKeyDefinition);

    // Generate random document id if the id is missing in the payload and
    // options.disableAutomaticIdGeneration != true
    if ((body.id === undefined || body.id === "") && !options.disableAutomaticIdGeneration) {
      body.id = uuid();
    }

    const err = {};
    if (!isResourceValid(body, err)) {
      throw err;
    }

    const path = getPathFromLink(this.container.url, ResourceType.item);
    const id = getIdFromLink(this.container.url);

    const response = await this.clientContext.upsert<T>({
      body,
      path,
      resourceType: ResourceType.item,
      resourceId: id,
      options,
      partitionKey
    });

    const ref = new Item(
      this.container,
      (response.result as any).id,
      partitionKey,
      this.clientContext
    );
    return new ItemResponse(
      response.result,
      response.headers,
      response.code,
      response.substatus,
      ref
    );
  }

  public async bulk(operations: Operation[], options?: RequestOptions) {
    const {
      resources: partitionKeyRanges
    } = await this.container.readPartitionKeyRanges().fetchAll();
    const batches: Batch[] = partitionKeyRanges.map((keyRange: PartitionKeyRange) => {
      return {
        min: keyRange.minInclusive,
        max: keyRange.maxExclusive,
        rangeId: keyRange.id,
        operations: []
      };
    });
    operations.forEach((operation: Operation) => {
      const key = hashPartitionKey(operation.resourceBody?.key || operation.partitionKey);
      let batchForKey = batches.find((batch: Batch) => {
        let minInt = parseInt(`0x${batch.min}`);
        let maxInt = parseInt(`0x${batch.max}`);
        if (batch.min === "") {
          minInt = 0;
        }
        if (batch.max === "FF") {
          maxInt = MAX_UNSIGNED_32_INTEGER;
        }
        return isKeyInRange(minInt, maxInt, key);
      });
      if (!batchForKey) {
        // this would mean our partitionKey isn't in any of the existing ranges
      }
      batchForKey.operations.push(operation);
    });

    const path = getPathFromLink(this.container.url, ResourceType.item);

    console.log(JSON.stringify(batches));
    return Promise.all(
      batches
        .filter((batch: Batch) => batch.operations.length)
        .map(async (batch: Batch) => {
          return this.clientContext.bulk({
            body: batch.operations,
            partitionKeyRange: batch.rangeId,
            path,
            resourceId: this.container.url,
            options
          });
        })
    );
  }
}

interface Batch {
  min: string;
  max: string;
  rangeId: string;
  operations: Operation[];
}

const MAX_UNSIGNED_32_INTEGER = 4294967295;

function hashPartitionKey(partitionKey: string): number {
  return MurmurHash.hash(partitionKey, 0);
}

function isKeyInRange(min: number, max: number, key: number) {
  console.log({ min, max, key });
  const isAfterMinInclusive = min <= key;
  const isBeforeMax = max > key;
  console.log({ isAfterMinInclusive, isBeforeMax });
  return isAfterMinInclusive && isBeforeMax;
}

export interface Operation {
  // 'Patch' is excluded to be added later
  operationType: "Create" | "Read" | "Upsert" | "Replace" | "Delete";
  /* String conforming to header partition key value */
  partitionKey?: string;
  id?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
  resourceBody?: any;
}
