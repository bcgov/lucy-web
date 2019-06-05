

// Application Migration interface


export class ApplicationTableColumn {
    name: string;
    comment: string = 'Application table column';
    struct: string = ''
    constructor(name: string,comment: string, struct?: string) {
        this.name = name;
        this.comment = comment;
    }
}

export class ApplicationTable {
    name: string;
    columnsDefinition: {[key: string] : ApplicationTableColumn};
    description: string = 'Application table';
    private _columnNames: {[key: string] : string};

    get columns(): {[key: string] : string} {
        if (this._columnNames) {
            return this._columnNames;
        }
        let names: {[key: string] : string} = {};
        for (let k in this.columnsDefinition) {
            let col: ApplicationTableColumn = this.columnsDefinition[k];
            names[k] = col.name
        }
        this._columnNames = names
        return this._columnNames;
    }
}

export class  BaseTableSchema {

    static shareInstance: BaseTableSchema;
    table: ApplicationTable;
    joinTables: {[key: string] : ApplicationTable};

    static get timestampColumns(): {[key: string] : string} {
        return {
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            deletedAt: 'deleted_at'
        }
    }

    static get shared(): BaseTableSchema {
        return this.shareInstance || (this.shareInstance = new this());
    }

    defineTable(): ApplicationTable {
        return new ApplicationTable();
    }

    defineJoinTable(): {[key: string]: ApplicationTable} {
        return {};
    }

    constructor() {
        this.table = this.defineTable();
        this.joinTables = this.defineJoinTable();
    }

    createTimestampsColumn(): string {
        return `ALTER TABLE ${this.table.name} ADD COLUMN ${BaseTableSchema.timestampColumns.createdAt} TIMESTAMP DEFAULT NOW();
        ALTER TABLE ${this.table.name} ADD COLUMN ${BaseTableSchema.timestampColumns.updatedAt} TIMESTAMP DEFAULT NOW();`;
    }

    createComments(): string {
        let commentForColumns: string = ``;
        for (const key in this.table.columnsDefinition) {
            const column: ApplicationTableColumn = this.table.columnsDefinition[key];
            commentForColumns = commentForColumns + `COMMENT ON COLUMN ${this.table.name}.${column.name} IS '${column.comment}';\n`
        }
        return `COMMENT ON TABLE ${this.table.name} IS '${this.table.description}';\n${commentForColumns}`;
    }

    dropTable(): string {
        return `DROP TABLE IF EXISTS ${this.table.name}`
    }

    public static get schema(): ApplicationTable {
        return this.shared.table;
    }

}

export const defineColumn = (name: string, comment: string, struct?: string): ApplicationTableColumn => {
    return new ApplicationTableColumn(name, comment, struct)
}