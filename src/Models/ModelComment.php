<?php

namespace Narsil\Tables\Models;

#region USE

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Narsil\Auth\Models\User;

#endregion

/**
 * @version 1.0.0
 *
 * @author Jonathan Rigaux
 */
class ModelComment extends Model
{
    #region CONSTRUCTOR

    /**
     * @param array $attributes
     *
     * @return void
     */
    public function __construct(array $attributes = [])
    {
        $this->table = self::TABLE;

        $this->with = [
            self::RELATIONSHIP_AUTHOR,
            self::RELATIONSHIP_LAST_EDITOR,
        ];

        parent::__construct($attributes);
    }

    #endregion

    #region CONSTANTS

    /**
     * @var string
     */
    final public const AUTHOR_ID = 'author_id';
    /**
     * @var string
     */
    final public const CONTENT = 'content';
    /**
     * @var string
     */
    final public const ID = 'id';
    /**
     * @var string
     */
    final public const LAST_EDITOR_ID = 'last_editor_id';
    /**
     * @var string
     */
    final public const MODEL_ID = 'model_id';
    /**
     * @var string
     */
    final public const MODEL_TYPE = 'model_type';

    /**
     * @var string
     */
    final public const RELATIONSHIP_AUTHOR = 'author';
    /**
     * @var string
     */
    final public const RELATIONSHIP_MODEL = 'model';
    /**
     * @var string
     */
    final public const RELATIONSHIP_LAST_EDITOR = 'last_editor';

    /**
     * @var string
     */
    final public const TABLE = 'model_comments';

    #endregion

    #region RELATIONSHIPS

    /**
     * @return BelongsTo
     */
    final public function author(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            self::AUTHOR_ID,
            User::ID
        );
    }

    /**
     * @return BelongsTo
     */
    final public function last_editor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            self::LAST_EDITOR_ID,
            User::ID
        );
    }

    /**
     * @return MorphTo
     */
    final public function model(): MorphTo
    {
        return $this->morphTo(
            self::RELATIONSHIP_MODEL,
            self::MODEL_TYPE,
            self::MODEL_ID
        );
    }

    #endregion
}
