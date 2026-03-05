import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Usuario from './Usuario';
import Caja from './Caja';

@Table({
    tableName: 'negocios'
})
class Negocio extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare nombre: string;

    @Column({
        type: DataType.STRING
    })
    declare config_moneda: string;

    @HasMany(() => Usuario)
    declare usuarios: Usuario[];

    @HasMany(() => Caja)
    declare cajas: Caja[];
}

export default Negocio;