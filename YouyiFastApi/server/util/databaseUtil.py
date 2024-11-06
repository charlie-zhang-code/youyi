import os
import sqlite3


class DatabaseUtil:
    def __init__(self):
        self.db_file = "server/data/fa.sqlite"
        self.conn = None
        self.create_database()

    def create_database(self):
        """创建数据库文件"""
        if not os.path.exists(self.db_file):  # 如果数据库文件不存在，则创建一个
            self.conn = sqlite3.connect(self.db_file)
            self.conn.close()

        with open('server/data/create_meeting_table.sql', encoding='utf-8') as f:
            sql = f.read()
            self.execute(sql)

    def execute(self, sql, data=None):
        """执行sql语句"""
        with sqlite3.connect(self.db_file) as conn:
            cursor = conn.cursor()
            if data:
                cursor.execute(sql, data)
            else:
                cursor.execute(sql)
            conn.commit()

            if sql.strip().upper().startswith('INSERT'):
                return cursor.lastrowid
            else:
                return cursor.fetchall()

    def insert(self, data, table='meeting'):
        processed_data = {}
        for key, value in data.items():
            if isinstance(value, list):
                processed_value = ','.join(map(str, value))
            else:
                processed_value = value
            processed_data[key] = processed_value

        keys = ', '.join(processed_data.keys())
        values = ', '.join(['?'] * len(processed_data))
        sql = f"INSERT INTO {table} ({keys}) VALUES ({values})"
        return self.execute(sql, tuple(processed_data.values()))

    def get(self, table='meeting', condition=None, fields=None, order_by=None, limit=None):
        """查询数据"""
        sql = f"SELECT {fields if fields else '*'} FROM {table}"
        if condition:
            sql += " WHERE " + condition
        if order_by:
            sql += " ORDER BY " + order_by
        if limit:
            sql += " LIMIT " + limit
        return self.execute(sql)  # 确保 return 语句在这里

    def update(self, data, condition, table="meeting"):
        """更新数据"""
        processed_data = {}
        for key, value in data.items():
            if isinstance(value, list):
                processed_value = ','.join(map(str, value))
            else:
                processed_value = value
            processed_data[key] = processed_value

        sql = f"UPDATE {table} SET "
        sql += ', '.join([f"{key} = ?" for key in data])
        sql += " WHERE " + condition

        return self.execute(sql, tuple(tuple(processed_data.values())))

    def delete(self, condition, table="meeting"):
        """删除数据"""
        sql = f"DELETE FROM {table} WHERE " + condition
        return self.execute(sql)
